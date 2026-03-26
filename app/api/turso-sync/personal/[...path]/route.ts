import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/device-auth/jwt";
import {
  resolvePersonalCredentials,
  proxyWithRotation,
} from "@/lib/turso-proxy";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function handleProxy(req: Request, { params }: RouteParams) {
  // Verify JWT
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing access token" },
      { status: 401 },
    );
  }

  let payload;
  try {
    payload = await verifyAccessToken(authHeader.slice(7));
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const userId = payload.sub!;

  // Resolve Turso credentials for this user's personal DB
  const creds = await resolvePersonalCredentials(userId);
  if (!creds) {
    return NextResponse.json(
      { error: "Personal database not provisioned" },
      { status: 404 },
    );
  }

  // Forward to Turso (with auto-rotation on expired tokens)
  const { path } = await params;
  const subPath = path.join("/");
  return proxyWithRotation(req, creds, subPath, { type: "personal", userId });
}

export async function GET(req: Request, ctx: RouteParams) {
  return handleProxy(req, ctx);
}

export async function POST(req: Request, ctx: RouteParams) {
  return handleProxy(req, ctx);
}
