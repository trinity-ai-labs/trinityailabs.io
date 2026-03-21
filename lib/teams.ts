import { db } from "@/lib/db";
import { ensureTeamsTables, ensureUserColumns } from "@/lib/ensure-tables";
import { createDatabase, createDatabaseToken } from "@/lib/turso-admin";
import { randomBytes } from "crypto";

export async function ensureTeamsReady() {
  await ensureTeamsTables();
  await ensureUserColumns();
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateEncryptionKey(): string {
  return randomBytes(32).toString("base64");
}

export function generateId(): string {
  return crypto.randomUUID();
}

export async function getTeamMembership(teamId: string, userId: string) {
  const result = await db.execute({
    sql: "SELECT role FROM team_members WHERE team_id = ? AND user_id = ?",
    args: [teamId, userId],
  });
  return result.rows[0] ?? null;
}

export async function isTeamOwner(teamId: string, userId: string): Promise<boolean> {
  const member = await getTeamMembership(teamId, userId);
  return member?.role === "owner";
}

export async function provisionTursoDb(
  name: string
): Promise<{ dbName: string; dbUrl: string; token: string }> {
  const { dbName, dbUrl } = await createDatabase(name);
  const token = await createDatabaseToken(dbName);
  return { dbName, dbUrl, token };
}

export async function provisionPersonalDb(userId: string) {
  await ensureUserColumns();
  const existing = await db.execute({
    sql: "SELECT turso_db_url FROM user WHERE id = ?",
    args: [userId],
  });
  if (existing.rows[0]?.turso_db_url) return;

  const dbName = `trinity-personal-${userId.slice(0, 12).toLowerCase()}`;
  const { dbName: name, dbUrl, token } = await provisionTursoDb(dbName);

  await db.execute({
    sql: "UPDATE user SET turso_db_name = ?, turso_db_url = ?, turso_auth_token = ? WHERE id = ?",
    args: [name, dbUrl, token, userId],
  });
}
