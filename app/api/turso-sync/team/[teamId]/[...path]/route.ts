import { NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/device-auth";
import { db } from "@/lib/db";
import { ensureTeamsTables } from "@/lib/ensure-tables";
import { resolveTeamCredentials, proxyWithRotation } from "@/lib/turso-proxy";

let teamsTablesEnsured: Promise<void> | null = null;
import {
  validatePipelineWrites,
  warmProjectCache,
  type HranaPipelineBody,
  type ValidationContext,
} from "@/lib/sync-proxy";

interface RouteParams {
  params: Promise<{ teamId: string; path: string[] }>;
}

/** Hrana pipeline paths that contain SQL write operations. */
const PIPELINE_PATHS = new Set(["v2/pipeline", "v3/pipeline"]);

async function handleProxy(req: Request, { params }: RouteParams) {
  let payload;
  try {
    payload = await requireAccessToken(req);
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid access token" },
      { status: 401 },
    );
  }

  const userId = payload.sub!;
  const { teamId, path } = await params;

  // Resolve Turso credentials — also verifies team membership
  const creds = await resolveTeamCredentials(userId, teamId);
  if (!creds) {
    return NextResponse.json(
      { error: "Not a member of this team or team database not provisioned" },
      { status: 403 },
    );
  }

  const subPath = path.join("/");

  // Validate writes on Hrana pipeline requests (JSON only)
  if (
    req.method === "POST" &&
    PIPELINE_PATHS.has(subPath) &&
    req.headers.get("content-type")?.includes("json")
  ) {
    try {
      const body = (await req.json()) as HranaPipelineBody;

      // Resolve team role for the current user
      if (!teamsTablesEnsured) {
        teamsTablesEnsured = ensureTeamsTables().catch(() => {
          teamsTablesEnsured = null;
        });
      }
      await teamsTablesEnsured;
      const roleResult = await db.execute({
        sql: "SELECT role FROM team_members WHERE team_id = ? AND user_id = ?",
        args: [teamId, userId],
      });
      const teamRole =
        (roleResult.rows[0]?.role as "owner" | "member") ?? "member";

      const ctx: ValidationContext = {
        userId,
        teamId,
        teamRole,
        tursoUrl: creds.tursoUrl,
        tursoToken: creds.tursoToken,
      };

      // Warm project ownership cache on first request
      await warmProjectCache(teamId, creds.tursoUrl, creds.tursoToken);

      const result = await validatePipelineWrites(body, ctx);
      if (!result.allowed) {
        return NextResponse.json(
          {
            baton: null,
            base_url: null,
            results: [
              {
                type: "error",
                error: {
                  message: result.reason ?? "Write denied",
                  code: "PROXY_PERMISSION_DENIED",
                },
              },
            ],
          },
          { status: 403 },
        );
      }

      // Re-create the request with the parsed body for forwarding
      const forwardReq = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(body),
      });
      return proxyWithRotation(forwardReq, creds, subPath, {
        userId,
        teamId,
      });
    } catch (err) {
      console.error("[turso-sync] Write validation error:", err);
      return NextResponse.json(
        {
          baton: null,
          base_url: null,
          results: [
            {
              type: "error",
              error: {
                message: "Internal proxy error",
                code: "PROXY_INTERNAL_ERROR",
              },
            },
          ],
        },
        { status: 500 },
      );
    }
  }

  // Non-pipeline requests (sync frames, info, etc.) — forward with rotation
  return proxyWithRotation(req, creds, subPath, {
    type: "team",
    userId,
    teamId,
  });
}

export async function GET(req: Request, ctx: RouteParams) {
  return handleProxy(req, ctx);
}

export async function POST(req: Request, ctx: RouteParams) {
  return handleProxy(req, ctx);
}
