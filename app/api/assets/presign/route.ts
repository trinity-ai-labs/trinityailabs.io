import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAccessToken, isActiveSubscription } from "@/lib/device-auth";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";
import {
  presignUpload,
  presignDownload,
  buildStorageKey,
  deleteObject,
} from "@/lib/r2";
import {
  checkQuota,
  incrementUsage,
  decrementUsage,
  clearOverQuotaIfUnderLimit,
} from "@/lib/storage-quota";

// POST /api/assets/presign — get presigned URL for upload or download
export async function POST(req: Request) {
  let payload;
  try {
    payload = await requireAccessToken(req);
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid access token" },
      { status: 401 },
    );
  }

  // Check subscription
  if (!payload.subscription || !isActiveSubscription(payload.subscription)) {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const { action, scope, scopeId, projectId, fileName, contentType, fileSize } =
    body;

  if (!action || !["upload", "download", "delete"].includes(action)) {
    return NextResponse.json(
      { error: "action must be 'upload', 'download', or 'delete'" },
      { status: 400 },
    );
  }
  if (!scope || !["personal", "team"].includes(scope)) {
    return NextResponse.json(
      { error: "scope must be 'personal' or 'team'" },
      { status: 400 },
    );
  }
  if (!scopeId) {
    return NextResponse.json({ error: "scopeId is required" }, { status: 400 });
  }
  if (action !== "delete" && (!projectId || !fileName)) {
    return NextResponse.json(
      { error: "projectId and fileName are required" },
      { status: 400 },
    );
  }

  const userId = payload.sub!;

  // Verify access to the scope
  if (scope === "personal" && scopeId !== userId) {
    return NextResponse.json(
      { error: "Cannot access another user's assets" },
      { status: 403 },
    );
  }

  if (scope === "team") {
    await ensureSubscriptionsTable();
    const membership = await db.execute({
      sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
      args: [scopeId, userId],
    });
    if (!membership.rows.length) {
      return NextResponse.json(
        { error: "Not a member of this team" },
        { status: 403 },
      );
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────
  if (action === "delete") {
    const { storageKey, fileSize: deleteSize } = body;
    if (storageKey) {
      try {
        await deleteObject(storageKey);
      } catch (err) {
        console.warn("[presign] R2 delete failed:", err);
      }
    }
    if (deleteSize && Number(deleteSize) > 0) {
      await decrementUsage(scope, scopeId, Number(deleteSize));
      await clearOverQuotaIfUnderLimit(scope, scopeId);
    }
    return NextResponse.json({ ok: true });
  }

  // ── Upload — quota check ───────────────────────────────────────────
  if (action === "upload") {
    if (!contentType) {
      return NextResponse.json(
        { error: "contentType is required for uploads" },
        { status: 400 },
      );
    }

    const fileSizeNum = Number(fileSize) || 0;
    if (fileSizeNum > 0) {
      const quota = await checkQuota(scope, scopeId, fileSizeNum);
      if (!quota.allowed) {
        return NextResponse.json(
          {
            error: "Storage quota exceeded",
            usedBytes: quota.usedBytes,
            quotaBytes: quota.quotaBytes,
          },
          { status: 413 },
        );
      }
      // Optimistic increment — before the upload completes
      await incrementUsage(scope, scopeId, fileSizeNum);
    }

    const key = buildStorageKey(scope, scopeId, projectId, fileName);
    const url = await presignUpload(key, contentType);
    return NextResponse.json({ url, key });
  }

  // ── Download — always allowed (reads are never blocked, even over quota)
  const key = buildStorageKey(scope, scopeId, projectId, fileName);
  const url = await presignDownload(key);
  return NextResponse.json({ url, key });
}
