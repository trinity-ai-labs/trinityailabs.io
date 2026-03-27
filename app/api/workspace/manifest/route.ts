import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureTeamsTables,
  ensureUserColumns,
  ensureSubscriptionsTable,
  ensureUserPreferencesTable,
  ensureSponsoredSeatsTable,
} from "@/lib/ensure-tables";
import { requireAccessToken } from "@/lib/device-auth";
import { provisionPersonalDb } from "@/lib/teams";
import {
  getStorageUsage,
  getStorageQuota,
  getOverQuotaStatus,
} from "@/lib/storage-quota";

let tablesEnsured: Promise<void> | null = null;

function ensureAllTables(): Promise<void> {
  if (!tablesEnsured) {
    tablesEnsured = Promise.all([
      ensureUserColumns().catch(() => {}),
      ensureTeamsTables().catch(() => {}),
      ensureSubscriptionsTable().catch(() => {}),
      ensureUserPreferencesTable().catch(() => {}),
      ensureSponsoredSeatsTable().catch(() => {}),
    ]).then(() => {});
  }
  return tablesEnsured;
}

// GET /api/workspace/manifest — returns everything the desktop app needs
export async function GET(req: Request) {
  let payload;
  try {
    payload = await requireAccessToken(req);
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid access token" },
      { status: 401 },
    );
  }

  const userId = payload.sub!;

  await ensureAllTables();

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

  // Parallel: subscription + preferences + teams (all need only userId)
  const [subResult, prefsResult, teamsResult] = await Promise.all([
    db.execute({
      sql: "SELECT status, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      args: [userId],
    }),
    db.execute({
      sql: "SELECT key, value FROM user_preferences WHERE user_id = ?",
      args: [userId],
    }),
    db.execute({
      sql: `SELECT t.id, t.slug, t.name, t.encryption_key, tm.role,
              t.turso_db_url
            FROM teams t
            JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
            ORDER BY t.name`,
      args: [userId],
    }),
  ]);

  // Process subscription
  let subscription: {
    status: string;
    currentPeriodEnd: string | null;
    sponsoredBy?: { sponsorId: string; sponsorName: string } | null;
  } | null = null;

  if (subResult.rows.length) {
    subscription = {
      status: subResult.rows[0].status as string,
      currentPeriodEnd:
        (subResult.rows[0].current_period_end as string) ?? null,
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
            WHERE ss.user_id = ?
              AND (ss.status = 'active'
                OR (ss.status = 'cancelled' AND ss.effective_until > datetime('now')))
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

  // Process preferences
  const preferences: Record<string, string> = {};
  for (const row of prefsResult.rows) {
    preferences[row.key as string] = row.value as string;
  }

  const siteBase = process.env.BETTER_AUTH_URL ?? "https://trinityailabs.com";

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
        syncProxyUrl: (row.turso_db_url as string)
          ? `${siteBase}/api/turso-sync/team/${teamId}`
          : null,
        encryptionKey: (row.encryption_key as string) ?? null,
        storageUsedBytes: teamUsage.usedBytes,
        storageQuotaBytes: teamQuota.quotaBytes,
      };
    }),
  );

  // Personal storage
  const [personalUsage, personalQuota, personalOverQuota] = await Promise.all([
    getStorageUsage("personal", userId),
    getStorageQuota("personal", userId),
    getOverQuotaStatus("personal", userId),
  ]);

  return NextResponse.json({
    user: {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      handle: (user.handle as string) ?? null,
      role: (user.role as string) ?? null,
      syncProxyUrl: (user.turso_db_url as string)
        ? `${siteBase}/api/turso-sync/personal`
        : null,
    },
    subscription,
    preferences,
    teams,
    storage: {
      usedBytes: personalUsage.usedBytes,
      quotaBytes: personalQuota.quotaBytes,
      addonBytes: personalQuota.addonBytes,
      overQuotaSince: personalOverQuota.overQuotaSince,
    },
  });
}
