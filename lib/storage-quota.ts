import { db } from "@/lib/db";
import {
  ensureStorageUsageTable,
  ensureStorageAddonsTable,
} from "@/lib/ensure-tables";

/** 5 GB per seat */
const BYTES_PER_SEAT = 5 * 1024 * 1024 * 1024;

/** 10 GB per add-on pack */
const BYTES_PER_ADDON_PACK = 10 * 1024 * 1024 * 1024;

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  await Promise.all([ensureStorageUsageTable(), ensureStorageAddonsTable()]);
  tableEnsured = true;
}

export async function getStorageUsage(
  scope: string,
  scopeId: string,
): Promise<{ usedBytes: number }> {
  await ensureTable();
  const result = await db.execute({
    sql: "SELECT used_bytes FROM storage_usage WHERE scope = ? AND scope_id = ?",
    args: [scope, scopeId],
  });
  const usedBytes = result.rows.length ? Number(result.rows[0].used_bytes) : 0;
  return { usedBytes };
}

export async function incrementUsage(
  scope: string,
  scopeId: string,
  bytes: number,
): Promise<void> {
  await ensureTable();
  await db.execute({
    sql: `INSERT INTO storage_usage (scope, scope_id, used_bytes, updated_at)
          VALUES (?, ?, ?, datetime('now'))
          ON CONFLICT(scope, scope_id) DO UPDATE
          SET used_bytes = used_bytes + ?, updated_at = datetime('now')`,
    args: [scope, scopeId, bytes, bytes],
  });
}

export async function decrementUsage(
  scope: string,
  scopeId: string,
  bytes: number,
): Promise<void> {
  await ensureTable();
  await db.execute({
    sql: `UPDATE storage_usage
          SET used_bytes = MAX(0, used_bytes - ?), updated_at = datetime('now')
          WHERE scope = ? AND scope_id = ?`,
    args: [bytes, scope, scopeId],
  });
}

export async function getAddonBytes(userId: string): Promise<number> {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT COUNT(*) as pack_count
          FROM storage_addons
          WHERE beneficiary_id = ? AND status = 'active'`,
    args: [userId],
  });
  return Number(result.rows[0].pack_count) * BYTES_PER_ADDON_PACK;
}

export async function getStorageQuota(
  scope: string,
  scopeId: string,
): Promise<{ quotaBytes: number; seats: number; addonBytes: number }> {
  let seats = 1;
  let addonBytes = 0;

  if (scope === "team") {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM team_members WHERE team_id = ?",
      args: [scopeId],
    });
    seats = Number(result.rows[0].cnt) || 1;
  } else {
    addonBytes = await getAddonBytes(scopeId);
  }

  const quotaBytes = seats * BYTES_PER_SEAT + addonBytes;
  return { quotaBytes, seats, addonBytes };
}

export async function checkQuota(
  scope: string,
  scopeId: string,
  additionalBytes: number,
): Promise<{ allowed: boolean; usedBytes: number; quotaBytes: number }> {
  const { usedBytes } = await getStorageUsage(scope, scopeId);
  const { quotaBytes } = await getStorageQuota(scope, scopeId);
  const allowed = usedBytes + additionalBytes <= quotaBytes;

  // Track over-quota state for grace period enforcement
  if (!allowed) {
    await updateOverQuotaTracking(scope, scopeId, true);
  }

  return { allowed, usedBytes, quotaBytes };
}

/** 7-day grace period constant */
const GRACE_PERIOD_DAYS = 7;

/** Check if reads should be blocked (over quota for more than 7 days) */
export async function getOverQuotaStatus(
  scope: string,
  scopeId: string,
): Promise<{ blocked: boolean; overQuotaSince: string | null; daysRemaining: number | null }> {
  await ensureTable();
  const result = await db.execute({
    sql: "SELECT over_quota_since FROM storage_usage WHERE scope = ? AND scope_id = ?",
    args: [scope, scopeId],
  });

  if (!result.rows.length || !result.rows[0].over_quota_since) {
    return { blocked: false, overQuotaSince: null, daysRemaining: null };
  }

  const since = new Date(result.rows[0].over_quota_since as string);
  const now = new Date();
  const elapsed = (now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24);
  const daysRemaining = Math.max(0, Math.ceil(GRACE_PERIOD_DAYS - elapsed));

  return {
    blocked: elapsed >= GRACE_PERIOD_DAYS,
    overQuotaSince: result.rows[0].over_quota_since as string,
    daysRemaining,
  };
}

/** Set or clear the over_quota_since timestamp */
async function updateOverQuotaTracking(
  scope: string,
  scopeId: string,
  isOverQuota: boolean,
): Promise<void> {
  await ensureTable();
  if (isOverQuota) {
    // Only set if not already set (don't overwrite existing timestamp)
    await db.execute({
      sql: `UPDATE storage_usage
            SET over_quota_since = COALESCE(over_quota_since, datetime('now'))
            WHERE scope = ? AND scope_id = ? AND over_quota_since IS NULL`,
      args: [scope, scopeId],
    });
  } else {
    await db.execute({
      sql: `UPDATE storage_usage SET over_quota_since = NULL
            WHERE scope = ? AND scope_id = ?`,
      args: [scope, scopeId],
    });
  }
}

/** Clear over-quota tracking when user gets back under quota */
export async function clearOverQuotaIfUnderLimit(
  scope: string,
  scopeId: string,
): Promise<void> {
  const { usedBytes } = await getStorageUsage(scope, scopeId);
  const { quotaBytes } = await getStorageQuota(scope, scopeId);
  if (usedBytes <= quotaBytes) {
    await updateOverQuotaTracking(scope, scopeId, false);
  }
}
