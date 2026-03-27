import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { getStorageUsage, getStorageQuota } from "@/lib/storage-quota";
import {
  ensureSubscriptionsTable,
  ensureTeamsTables,
  ensureSponsoredSeatsTable,
} from "@/lib/ensure-tables";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await Promise.all([
      ensureSubscriptionsTable(),
      ensureTeamsTables(),
      ensureSponsoredSeatsTable(),
    ]);
  } catch {
    /* tables may already exist */
  }

  // Parallel: subscription + personal storage + teams
  const [subResult, personalUsage, personalQuota, teamsResult] =
    await Promise.all([
      db.execute({
        sql: `SELECT status, current_period_end, seats_purchased, lemonsqueezy_customer_id
              FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1`,
        args: [userId],
      }),
      getStorageUsage("personal", userId),
      getStorageQuota("personal", userId),
      db.execute({
        sql: `SELECT t.id, t.name, t.slug, tm.role,
                (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
              FROM teams t
              JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
              ORDER BY t.name`,
        args: [userId],
      }),
    ]);

  const subscription = subResult.rows.length
    ? {
        status: String(subResult.rows[0].status),
        currentPeriodEnd:
          (subResult.rows[0].current_period_end as string) ?? null,
        seatsPurchased: Number(subResult.rows[0].seats_purchased) || 1,
        hasCustomer: !!subResult.rows[0].lemonsqueezy_customer_id,
      }
    : null;

  // Check if user is sponsored (when no own active subscription)
  let sponsoredBy: {
    seatId: string;
    sponsorName: string;
    currentPeriodEnd: string | null;
    effectiveUntil: string | null;
  } | null = null;

  const ownActive =
    subscription?.status === "active" || subscription?.status === "comp";

  if (!ownActive) {
    const sponsorResult = await db.execute({
      sql: `SELECT ss.id AS seat_id, u.name AS sponsor_name,
              s.current_period_end, ss.effective_until
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
      const row = sponsorResult.rows[0];
      sponsoredBy = {
        seatId: row.seat_id as string,
        sponsorName: (row.sponsor_name as string) ?? "Someone",
        currentPeriodEnd: (row.current_period_end as string) ?? null,
        effectiveUntil: (row.effective_until as string) ?? null,
      };
    }
  }

  const teams = await Promise.all(
    teamsResult.rows.map(async (row) => {
      const teamId = row.id as string;
      const [usage, quota] = await Promise.all([
        getStorageUsage("team", teamId),
        getStorageQuota("team", teamId),
      ]);
      return {
        id: teamId,
        name: row.name as string,
        slug: row.slug as string,
        role: row.role as string,
        memberCount: Number(row.member_count),
        storageUsedBytes: usage.usedBytes,
        storageQuotaBytes: quota.quotaBytes,
      };
    }),
  );

  return NextResponse.json({
    subscription,
    sponsoredBy,
    storage: {
      usedBytes: personalUsage.usedBytes,
      quotaBytes: personalQuota.quotaBytes,
      addonBytes: personalQuota.addonBytes,
    },
    teams,
  });
}
