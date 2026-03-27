import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import {
  ensureSponsoredSeatsTable,
  ensureSubscriptionsTable,
} from "@/lib/ensure-tables";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await Promise.all([ensureSponsoredSeatsTable(), ensureSubscriptionsTable()]);

  // Check if user is currently sponsored — set trial bridge to avoid double-charging
  let trialEndsAt: string | undefined;

  const sponsorResult = await db.execute({
    sql: `SELECT s.current_period_end
          FROM sponsored_seats ss
          JOIN subscriptions s ON s.user_id = ss.sponsor_id
            AND s.status IN ('active', 'comp')
          WHERE ss.user_id = ?
            AND (ss.status = 'active'
              OR (ss.status = 'cancelled' AND ss.effective_until > datetime('now')))
          ORDER BY s.updated_at DESC
          LIMIT 1`,
    args: [session.user.id],
  });

  if (sponsorResult.rows.length) {
    const periodEnd = sponsorResult.rows[0].current_period_end as string | null;
    if (periodEnd && new Date(periodEnd) > new Date()) {
      trialEndsAt = periodEnd;
    }
  }

  const url = await createCheckoutUrl(
    session.user.email,
    session.user.id,
    trialEndsAt ? { trialEndsAt } : undefined,
  );

  return NextResponse.json({ url, trialEndsAt: trialEndsAt ?? null });
}
