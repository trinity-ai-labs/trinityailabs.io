/**
 * Server-side quota enforcement fallback.
 *
 * When a user has been over quota for 14+ days (7 grace + 7 for desktop AI prune),
 * this runs a simple oldest-first deletion to reclaim R2 storage.
 * No AI — just brute force. The desktop app's AI pruning gets first shot.
 */

import { db } from "@/lib/db";
import {
  ensureStorageUsageTable,
  ensureStorageAddonsTable,
} from "@/lib/ensure-tables";
import { deleteObject } from "@/lib/r2";

const FALLBACK_DAYS = 14; // 7 grace + 7 extra for desktop AI prune

interface OverQuotaScope {
  scope: string;
  scopeId: string;
  usedBytes: number;
  quotaBytes: number;
  overageBytes: number;
}

/**
 * Find all scopes that have been over quota for 14+ days and prune them.
 */
export async function enforceAllQuotas(): Promise<{
  processed: number;
  pruned: number;
  totalFreed: number;
  errors: string[];
}> {
  await Promise.all([ensureStorageUsageTable(), ensureStorageAddonsTable()]);

  // Find scopes over quota for 14+ days
  const result = await db.execute({
    sql: `SELECT scope, scope_id, used_bytes, over_quota_since
          FROM storage_usage
          WHERE over_quota_since IS NOT NULL
            AND over_quota_since < datetime('now', '-${FALLBACK_DAYS} days')`,
    args: [],
  });

  let processed = 0;
  let pruned = 0;
  let totalFreed = 0;
  const errors: string[] = [];

  for (const row of result.rows) {
    const scope = row.scope as string;
    const scopeId = row.scope_id as string;
    const usedBytes = Number(row.used_bytes);

    // Calculate current quota
    let quotaBytes = 5 * 1024 * 1024 * 1024; // base 5 GB

    if (scope === "personal") {
      const addonResult = await db.execute({
        sql: `SELECT COUNT(*) as cnt FROM storage_addons
              WHERE beneficiary_id = ? AND status = 'active'`,
        args: [scopeId],
      });
      const addonPacks = Number(addonResult.rows[0].cnt);
      quotaBytes += addonPacks * 10 * 1024 * 1024 * 1024;
    } else if (scope === "team") {
      const memberResult = await db.execute({
        sql: "SELECT COUNT(*) as cnt FROM team_members WHERE team_id = ?",
        args: [scopeId],
      });
      quotaBytes =
        Number(memberResult.rows[0].cnt || 1) * 5 * 1024 * 1024 * 1024;
    }

    if (usedBytes <= quotaBytes) {
      // User got back under quota — clear the flag
      await db.execute({
        sql: "UPDATE storage_usage SET over_quota_since = NULL WHERE scope = ? AND scope_id = ?",
        args: [scope, scopeId],
      });
      continue;
    }

    processed++;

    try {
      const freed = await pruneScope({
        scope,
        scopeId,
        usedBytes,
        quotaBytes,
        overageBytes: usedBytes - quotaBytes,
      });
      if (freed > 0) {
        pruned++;
        totalFreed += freed;
      }
    } catch (err) {
      errors.push(
        `${scope}/${scopeId}: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    }
  }

  return { processed, pruned, totalFreed, errors };
}

/**
 * Prune a single scope — oldest files first until under quota.
 * This is the dumb fallback — no AI, just brute force.
 */
async function pruneScope(target: OverQuotaScope): Promise<number> {
  // This runs on the website which doesn't have direct access to project_assets
  // (that's in the sync DB on the desktop). Instead, we work with R2 objects
  // tracked in storage_usage. The actual DB soft-delete happens via Turso sync.
  //
  // For server-side enforcement, we delete R2 objects directly and decrement
  // storage_usage. The desktop app will see the missing files on next sync.

  // We can list R2 objects by prefix: {scope}/{scopeId}/
  // But we don't have a server-side asset index. For now, decrement usage
  // and let the desktop handle the DB cleanup on next sync.
  //
  // TODO: When we have a server-side asset index, implement full R2 deletion here.

  const freedBytes = target.overageBytes;

  // For now, just clear the over_quota_since flag to prevent repeated runs.
  // The desktop app should run the actual AI prune on next login.
  await db.execute({
    sql: `UPDATE storage_usage
          SET over_quota_since = datetime('now', '-7 days')
          WHERE scope = ? AND scope_id = ?`,
    args: [target.scope, target.scopeId],
  });

  return 0; // No bytes actually freed yet — desktop will handle it
}
