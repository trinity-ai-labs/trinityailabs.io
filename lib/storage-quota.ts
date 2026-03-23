import { db } from "@/lib/db";
import { ensureStorageUsageTable } from "@/lib/ensure-tables";

/** 5 GB per seat */
const BYTES_PER_SEAT = 5 * 1024 * 1024 * 1024;

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  await ensureStorageUsageTable();
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

export async function getStorageQuota(
  scope: string,
  scopeId: string,
): Promise<{ quotaBytes: number; seats: number }> {
  let seats = 1;

  if (scope === "team") {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM team_members WHERE team_id = ?",
      args: [scopeId],
    });
    seats = Number(result.rows[0].cnt) || 1;
  }

  const quotaBytes = seats * BYTES_PER_SEAT;
  return { quotaBytes, seats };
}

export async function checkQuota(
  scope: string,
  scopeId: string,
  additionalBytes: number,
): Promise<{ allowed: boolean; usedBytes: number; quotaBytes: number }> {
  const { usedBytes } = await getStorageUsage(scope, scopeId);
  const { quotaBytes } = await getStorageQuota(scope, scopeId);
  const allowed = usedBytes + additionalBytes <= quotaBytes;
  return { allowed, usedBytes, quotaBytes };
}
