import crypto from "crypto";
import { db } from "@/lib/db";
import { ensureRefreshTokensTable } from "@/lib/ensure-tables";

export async function createRefreshToken(userId: string): Promise<string> {
  await ensureRefreshTokensTable();
  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await db.execute({
    sql: "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)",
    args: [token, userId, expiresAt],
  });

  return token;
}

export async function consumeRefreshToken(
  token: string,
): Promise<string | null> {
  await ensureRefreshTokensTable();
  const result = await db.execute({
    sql: `UPDATE refresh_tokens SET revoked = 1
          WHERE token = ? AND revoked = 0 AND expires_at > datetime('now')
          RETURNING user_id`,
    args: [token],
  });
  if (!result.rows.length) return null;
  return result.rows[0].user_id as string;
}

export async function revokeUserRefreshTokens(userId: string): Promise<void> {
  await ensureRefreshTokensTable();
  await db.execute({
    sql: "UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?",
    args: [userId],
  });
}
