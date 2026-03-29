import crypto from "crypto";
import { db } from "@/lib/db";
import { ensureDeviceCodesTable } from "@/lib/ensure-tables";

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function createDeviceCode(): Promise<{
  code: string;
  expiresAt: string;
}> {
  await ensureDeviceCodesTable();
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.execute({
    sql: "INSERT INTO device_codes (code, expires_at) VALUES (?, ?)",
    args: [code, expiresAt],
  });

  return { code, expiresAt };
}

export async function approveDeviceCode(
  code: string,
  userId: string,
): Promise<boolean> {
  await ensureDeviceCodesTable();
  const result = await db.execute({
    sql: `UPDATE device_codes SET status = 'approved', user_id = ?
          WHERE code = ? AND status = 'pending' AND expires_at > datetime('now')`,
    args: [userId, code],
  });
  return result.rowsAffected > 0;
}

export async function consumeDeviceCode(code: string): Promise<string | null> {
  await ensureDeviceCodesTable();
  const result = await db.execute({
    sql: `UPDATE device_codes SET status = 'used'
          WHERE code = ? AND status = 'approved' AND expires_at > datetime('now')
          RETURNING user_id`,
    args: [code],
  });
  if (!result.rows.length) return null;
  return result.rows[0].user_id as string;
}

export async function getDeviceCodeStatus(
  code: string,
): Promise<"pending" | "approved" | "used" | "expired" | "not_found"> {
  await ensureDeviceCodesTable();
  const result = await db.execute({
    sql: "SELECT status, expires_at FROM device_codes WHERE code = ?",
    args: [code],
  });
  if (!result.rows.length) return "not_found";
  const row = result.rows[0];
  if (new Date(row.expires_at as string) <= new Date()) return "expired";
  return row.status as "pending" | "approved" | "used";
}

export async function cleanupExpiredCodes(): Promise<void> {
  await ensureDeviceCodesTable();
  await db.execute(
    "DELETE FROM device_codes WHERE created_at < datetime('now', '-1 hour')",
  );
}
