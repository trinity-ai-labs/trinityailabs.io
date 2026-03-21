import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureTeamsTables,
  ensureUserColumns,
  ensureSubscriptionsTable,
  ensureUserPreferencesTable,
} from "@/lib/ensure-tables";
import { verifyAccessToken } from "@/lib/device-auth/jwt";
import { provisionPersonalDb } from "@/lib/teams";

// GET /api/workspace/manifest — returns everything the desktop app needs
export async function GET(req: Request) {
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

  const userId = payload.sub!;

  await ensureUserColumns();
  await ensureTeamsTables();
  await ensureSubscriptionsTable();
  await ensureUserPreferencesTable();

  // Get user info (including personal Turso DB)
  const userResult = await db.execute({
    sql: `SELECT id, email, name, handle, turso_db_url, turso_auth_token
          FROM user WHERE id = ?`,
    args: [userId],
  });

  if (!userResult.rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = userResult.rows[0];

  // Provision personal DB lazily if not yet done
  if (!user.turso_db_url) {
    try {
      await provisionPersonalDb(userId);
      // Re-fetch after provisioning
      const updated = await db.execute({
        sql: "SELECT turso_db_url, turso_auth_token FROM user WHERE id = ?",
        args: [userId],
      });
      if (updated.rows.length) {
        user.turso_db_url = updated.rows[0].turso_db_url;
        user.turso_auth_token = updated.rows[0].turso_auth_token;
      }
    } catch (err) {
      console.error("Personal DB provisioning failed:", err);
      // Continue without — desktop will use local fallback
    }
  }

  // Get subscription
  const subResult = await db.execute({
    sql: "SELECT status, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
    args: [userId],
  });
  const subscription = subResult.rows.length
    ? {
        status: subResult.rows[0].status as string,
        currentPeriodEnd: (subResult.rows[0].current_period_end as string) ?? null,
      }
    : null;

  // Get user preferences
  const prefsResult = await db.execute({
    sql: "SELECT key, value FROM user_preferences WHERE user_id = ?",
    args: [userId],
  });
  const preferences: Record<string, string> = {};
  for (const row of prefsResult.rows) {
    preferences[row.key as string] = row.value as string;
  }

  // Get teams with Turso tokens and encryption keys
  const teamsResult = await db.execute({
    sql: `SELECT t.id, t.slug, t.name, t.encryption_key, tm.role, tm.turso_token,
            t.turso_db_url
          FROM teams t
          JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
          ORDER BY t.name`,
    args: [userId],
  });

  const teams = teamsResult.rows.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    role: row.role as string,
    tursoDbUrl: (row.turso_db_url as string) ?? null,
    tursoAuthToken: (row.turso_token as string) ?? null,
    encryptionKey: (row.encryption_key as string) ?? null,
  }));

  return NextResponse.json({
    user: {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      handle: (user.handle as string) ?? null,
      tursoDbUrl: (user.turso_db_url as string) ?? null,
      tursoAuthToken: (user.turso_auth_token as string) ?? null,
    },
    subscription,
    preferences,
    teams,
  });
}
