import { NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/device-auth";
import {
  resolvePersonalCredentials,
  proxyWithRotation,
} from "@/lib/turso-proxy";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

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
