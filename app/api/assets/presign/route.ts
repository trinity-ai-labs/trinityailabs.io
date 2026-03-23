import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/device-auth/jwt";
import { isActiveSubscription } from "@/lib/device-auth/subscription";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";
import { presignUpload, presignDownload, buildStorageKey } from "@/lib/r2";

// POST /api/assets/presign — get presigned URL for upload or download
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing access token" }, { status: 401 });
  }

  let payload;
  try {
    payload = await verifyAccessToken(authHeader.slice(7));
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Check subscription
  if (!payload.subscription || !isActiveSubscription(payload.subscription)) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  const body = await req.json();
  const { action, scope, scopeId, projectId, fileName, contentType } = body;

  if (!action || !["upload", "download"].includes(action)) {
    return NextResponse.json({ error: "action must be 'upload' or 'download'" }, { status: 400 });
  }
  if (!scope || !["personal", "team"].includes(scope)) {
    return NextResponse.json({ error: "scope must be 'personal' or 'team'" }, { status: 400 });
  }
  if (!scopeId || !projectId || !fileName) {
    return NextResponse.json({ error: "scopeId, projectId, and fileName are required" }, { status: 400 });
  }

  const userId = payload.sub!;

  // Verify access to the scope
  if (scope === "personal" && scopeId !== userId) {
    return NextResponse.json({ error: "Cannot access another user's assets" }, { status: 403 });
  }

  if (scope === "team") {
    await ensureSubscriptionsTable();
    const membership = await db.execute({
      sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
      args: [scopeId, userId],
    });
    if (!membership.rows.length) {
      return NextResponse.json({ error: "Not a member of this team" }, { status: 403 });
    }
  }

  const key = buildStorageKey(scope, scopeId, projectId, fileName);

  let url: string;
  if (action === "upload") {
    if (!contentType) {
      return NextResponse.json({ error: "contentType is required for uploads" }, { status: 400 });
    }
    url = await presignUpload(key, contentType);
  } else {
    url = await presignDownload(key);
  }

  return NextResponse.json({ url, key });
}
