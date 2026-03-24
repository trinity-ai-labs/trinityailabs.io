import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/device-auth/jwt";
import { isActiveSubscription } from "@/lib/device-auth/subscription";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";
import { copyObject, deleteObject, buildStorageKey } from "@/lib/r2";
import { incrementUsage, decrementUsage } from "@/lib/storage-quota";

type Scope = "personal" | "team";

interface AssetEntry {
  storageKey: string;
  size: number;
}

// POST /api/assets/migrate — move R2 objects between scope prefixes
export async function POST(req: Request) {
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

  if (!payload.subscription || !isActiveSubscription(payload.subscription)) {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const { projectId, fromScope, fromScopeId, toScope, toScopeId, assets } =
    body as {
      projectId: string;
      fromScope: Scope;
      fromScopeId: string;
      toScope: Scope;
      toScopeId: string;
      assets: AssetEntry[];
    };

  if (!projectId || !fromScope || !fromScopeId || !toScope || !toScopeId) {
    return NextResponse.json(
      { error: "projectId, fromScope, fromScopeId, toScope, toScopeId are required" },
      { status: 400 },
    );
  }

  if (!["personal", "team"].includes(fromScope) || !["personal", "team"].includes(toScope)) {
    return NextResponse.json(
      { error: "scope must be 'personal' or 'team'" },
      { status: 400 },
    );
  }

  if (!assets || !Array.isArray(assets) || assets.length === 0) {
    return NextResponse.json({ migrated: [], failed: [] });
  }

  const userId = payload.sub!;

  // Verify access to source scope
  if (fromScope === "personal" && fromScopeId !== userId) {
    return NextResponse.json(
      { error: "Cannot migrate another user's assets" },
      { status: 403 },
    );
  }

  if (fromScope === "team") {
    await ensureSubscriptionsTable();
    const membership = await db.execute({
      sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
      args: [fromScopeId, userId],
    });
    if (!membership.rows.length) {
      return NextResponse.json(
        { error: "Not a member of the source team" },
        { status: 403 },
      );
    }
  }

  // Verify access to target scope
  if (toScope === "personal" && toScopeId !== userId) {
    return NextResponse.json(
      { error: "Cannot migrate assets to another user" },
      { status: 403 },
    );
  }

  if (toScope === "team") {
    await ensureSubscriptionsTable();
    const membership = await db.execute({
      sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
      args: [toScopeId, userId],
    });
    if (!membership.rows.length) {
      return NextResponse.json(
        { error: "Not a member of the target team" },
        { status: 403 },
      );
    }
  }

  // Migrate each asset: copy to new key, delete old key
  const migrated: Array<{ oldKey: string; newKey: string }> = [];
  const failed: Array<{ storageKey: string; error: string }> = [];
  let totalBytes = 0;

  for (const asset of assets) {
    const { storageKey, size } = asset;
    if (!storageKey) continue;

    // Extract fileName from the old key (last segment)
    const parts = storageKey.split("/");
    const fileName = parts[parts.length - 1];
    if (!fileName) {
      failed.push({ storageKey, error: "Could not extract fileName from key" });
      continue;
    }

    const newKey = buildStorageKey(toScope, toScopeId, projectId, fileName);

    // Skip if already at the correct key (idempotent retry)
    if (storageKey === newKey) {
      migrated.push({ oldKey: storageKey, newKey });
      totalBytes += size || 0;
      continue;
    }

    try {
      await copyObject(storageKey, newKey);
      await deleteObject(storageKey);
      migrated.push({ oldKey: storageKey, newKey });
      totalBytes += size || 0;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ storageKey, error: message });
    }
  }

  // Transfer quota for successfully migrated assets
  if (totalBytes > 0) {
    await decrementUsage(fromScope, fromScopeId, totalBytes);
    await incrementUsage(toScope, toScopeId, totalBytes);
  }

  return NextResponse.json({ migrated, failed });
}
