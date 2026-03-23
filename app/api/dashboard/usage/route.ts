import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { getStorageUsage, getStorageQuota } from "@/lib/storage-quota";
import {
  ensureSubscriptionsTable,
  ensureTeamsTables,
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
    await Promise.all([ensureSubscriptionsTable(), ensureTeamsTables()]);
  } catch {
    /* tables may already exist */
  }

  // Subscription
  const subResult = await db.execute({
    sql: `SELECT status, current_period_end, seats_purchased, lemonsqueezy_customer_id
          FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1`,
    args: [userId],
  });

  const subscription = subResult.rows.length
    ? {
        status: String(subResult.rows[0].status),
        currentPeriodEnd:
          (subResult.rows[0].current_period_end as string) ?? null,
        seatsPurchased: Number(subResult.rows[0].seats_purchased) || 1,
        hasCustomer: !!subResult.rows[0].lemonsqueezy_customer_id,
      }
    : null;

  // Personal storage
  const [personalUsage, personalQuota] = await Promise.all([
    getStorageUsage("personal", userId),
    getStorageQuota("personal", userId),
  ]);

  // Teams with storage
  const teamsResult = await db.execute({
    sql: `SELECT t.id, t.name, t.slug, tm.role,
            (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
          FROM teams t
          JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
          ORDER BY t.name`,
    args: [userId],
  });

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
    storage: {
      usedBytes: personalUsage.usedBytes,
      quotaBytes: personalQuota.quotaBytes,
    },
    teams,
  });
}
