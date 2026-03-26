import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureTeamsTables,
  ensureUserColumns,
  ensureSubscriptionsTable,
  ensureUserPreferencesTable,
  ensureSponsoredSeatsTable,
} from "@/lib/ensure-tables";
import { verifyAccessToken } from "@/lib/device-auth/jwt";
import { provisionPersonalDb } from "@/lib/teams";
import { getStorageUsage, getStorageQuota } from "@/lib/storage-quota";

// GET /api/workspace/manifest — returns everything the desktop app needs
export async function GET(req: Request) {
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

  const userId = payload.sub!;

  try {
    await ensureUserColumns();
  } catch {
    /* columns may already exist */
  }
  try {
    await ensureTeamsTables();
  } catch {
    /* tables may already exist */
  }
  try {
    await ensureSubscriptionsTable();
  } catch {
    /* table may already exist */
  }
  try {
    await ensureUserPreferencesTable();
  } catch {
    /* table may already exist */
  }
  try {
    await ensureSponsoredSeatsTable();
  } catch {
    /* table may already exist */
  }

  // Get user info — query basic columns first, then try extended columns
  let user: Record<string, unknown>;
  try {
    const userResult = await db.execute({
      sql: `SELECT id, email, name, handle, role, turso_db_url, turso_auth_token FROM user WHERE id = ?`,
      args: [userId],
    });
    if (!userResult.rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user = userResult.rows[0] as Record<string, unknown>;
  } catch {
    // Extended columns may not exist yet — fall back to basic query
    const userResult = await db.execute({
      sql: `SELECT id, email, name FROM user WHERE id = ?`,
      args: [userId],
    });
    if (!userResult.rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user = {
      ...(userResult.rows[0] as Record<string, unknown>),
      handle: null,
      turso_db_url: null,
      turso_auth_token: null,
    };
  }

  // Provision personal DB lazily if not yet done (non-blocking)
  if (!user.turso_db_url) {
    try {
      await provisionPersonalDb(userId);
      const updated = await db.execute({
        sql: "SELECT turso_db_url, turso_auth_token FROM user WHERE id = ?",
        args: [userId],
      });
      if (updated.rows.length) {
        user.turso_db_url = updated.rows[0].turso_db_url;
        user.turso_auth_token = updated.rows[0].turso_auth_token;
      }
    } catch (err) {
      console.error("Personal DB provisioning failed (non-fatal):", err);
    }
  }

  // Get subscription — check own subscription first, then sponsorship
  const subResult = await db.execute({
    sql: "SELECT status, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
    args: [userId],
  });

  let subscription: {
    status: string;
    currentPeriodEnd: string | null;
    sponsoredBy?: { sponsorId: string; sponsorName: string } | null;
  } | null = null;

  if (subResult.rows.length) {
    subscription = {
      status: subResult.rows[0].status as string,
      currentPeriodEnd: (subResult.rows[0].current_period_end as string) ?? null,
      sponsoredBy: null,
    };
  }

  // If no own active subscription, check if sponsored
  const ownActive =
    subscription?.status === "active" || subscription?.status === "comp";
  if (!ownActive) {
    const sponsorResult = await db.execute({
      sql: `SELECT ss.sponsor_id, u.name AS sponsor_name,
              s.status AS sponsor_sub_status, s.current_period_end
            FROM sponsored_seats ss
            JOIN user u ON u.id = ss.sponsor_id
            JOIN subscriptions s ON s.user_id = ss.sponsor_id
              AND s.status IN ('active', 'comp')
            WHERE ss.user_id = ? AND ss.status = 'active'
            ORDER BY s.updated_at DESC
            LIMIT 1`,
      args: [userId],
    });

    if (sponsorResult.rows.length) {
      const sponsor = sponsorResult.rows[0];
      subscription = {
        status: "active",
        currentPeriodEnd: (sponsor.current_period_end as string) ?? null,
        sponsoredBy: {
          sponsorId: sponsor.sponsor_id as string,
          sponsorName: sponsor.sponsor_name as string,
        },
      };
    }
  }

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

  // Build teams with storage data
  const teams = await Promise.all(
    teamsResult.rows.map(async (row) => {
      const teamId = row.id as string;
      const [teamUsage, teamQuota] = await Promise.all([
        getStorageUsage("team", teamId),
        getStorageQuota("team", teamId),
      ]);
      return {
        id: teamId,
        slug: row.slug as string,
        name: row.name as string,
        role: row.role as string,
        tursoDbUrl: (row.turso_db_url as string) ?? null,
        tursoAuthToken: (row.turso_token as string) ?? null,
        encryptionKey: (row.encryption_key as string) ?? null,
        storageUsedBytes: teamUsage.usedBytes,
        storageQuotaBytes: teamQuota.quotaBytes,
      };
    }),
  );

  // Personal storage
  const [personalUsage, personalQuota] = await Promise.all([
    getStorageUsage("personal", userId),
    getStorageQuota("personal", userId),
  ]);

  return NextResponse.json({
    user: {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      handle: (user.handle as string) ?? null,
      role: (user.role as string) ?? null,
      tursoDbUrl: (user.turso_db_url as string) ?? null,
      tursoAuthToken: (user.turso_auth_token as string) ?? null,
    },
    subscription,
    preferences,
    teams,
    storage: {
      usedBytes: personalUsage.usedBytes,
      quotaBytes: personalQuota.quotaBytes,
    },
  });
}
