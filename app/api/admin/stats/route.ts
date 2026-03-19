import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import {
  ensureSubscriptionsTable,
  ensureRoleColumn,
} from "@/lib/ensure-tables";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Promise.all([ensureSubscriptionsTable(), ensureRoleColumn()]);

  const [usersResult, subsResult, signupsResult] = await Promise.all([
    db.execute("SELECT COUNT(*) as count FROM user"),
    db.execute(
      "SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status"
    ),
    db.execute(
      `SELECT date(createdAt) as date, COUNT(*) as count FROM user WHERE createdAt >= datetime('now', '-30 days') GROUP BY date(createdAt) ORDER BY date`
    ),
  ]);

  const totalUsers = Number(usersResult.rows[0]?.count ?? 0);

  const subscriptionBreakdown: Record<string, number> = {};
  let activeSubscriptions = 0;
  let cancelledCount = 0;

  for (const row of subsResult.rows) {
    const status = String(row.status);
    const count = Number(row.count);
    subscriptionBreakdown[status] = count;
    if (status === "active" || status === "comp") activeSubscriptions += count;
    if (status === "cancelled") cancelledCount = count;
  }

  const paidActive = subscriptionBreakdown["active"] ?? 0;
  const mrr = paidActive * 10;

  const signupsPerDay = signupsResult.rows.map((row) => ({
    date: String(row.date),
    count: Number(row.count),
  }));

  return NextResponse.json({
    totalUsers,
    activeSubscriptions,
    mrr,
    cancelledCount,
    signupsPerDay,
    subscriptionBreakdown,
  });
}
