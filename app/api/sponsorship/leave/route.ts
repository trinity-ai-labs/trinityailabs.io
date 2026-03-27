import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import {
  ensureSponsoredSeatsTable,
  ensureSubscriptionsTable,
} from "@/lib/ensure-tables";
import { updateSubscriptionQuantity } from "@/lib/lemonsqueezy";

// POST /api/sponsorship/leave — sponsored user cancels their own sponsorship
export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await Promise.all([ensureSponsoredSeatsTable(), ensureSubscriptionsTable()]);

  // Find user's active sponsored seat
  const seatResult = await db.execute({
    sql: `SELECT ss.id, ss.sponsor_id
          FROM sponsored_seats ss
          WHERE ss.user_id = ? AND ss.status = 'active'
          LIMIT 1`,
    args: [userId],
  });

  if (!seatResult.rows.length) {
    return NextResponse.json(
      { error: "No active sponsorship found" },
      { status: 404 },
    );
  }

  const seat = seatResult.rows[0];
  const sponsorId = seat.sponsor_id as string;

  // Get sponsor's subscription for period end + quantity update
  const subResult = await db.execute({
    sql: `SELECT id, lemonsqueezy_subscription_id, seats_purchased, current_period_end
          FROM subscriptions
          WHERE user_id = ? AND status IN ('active', 'comp')
          ORDER BY updated_at DESC LIMIT 1`,
    args: [sponsorId],
  });

  let effectiveUntil: string | null = null;

  if (subResult.rows.length) {
    const sub = subResult.rows[0];
    const subId = sub.id as string;
    const lsSubId = sub.lemonsqueezy_subscription_id as string | null;
    const currentSeats = (sub.seats_purchased as number) ?? 1;
    const newSeats = Math.max(1, currentSeats - 1);

    effectiveUntil = (sub.current_period_end as string) ?? null;

    // Decrement sponsor's seat count immediately
    if (lsSubId) {
      try {
        await updateSubscriptionQuantity(lsSubId, newSeats);
      } catch (err) {
        console.error("Failed to update sponsor seat count:", err);
        return NextResponse.json(
          { error: "Failed to update billing. Please try again." },
          { status: 500 },
        );
      }
    }

    await db.execute({
      sql: "UPDATE subscriptions SET seats_purchased = ? WHERE id = ?",
      args: [newSeats, subId],
    });
  }

  // Cancel the seat with grace period
  await db.execute({
    sql: `UPDATE sponsored_seats
          SET status = 'cancelled',
              cancelled_at = datetime('now'),
              cancelled_by = 'user',
              effective_until = ?
          WHERE id = ?`,
    args: [effectiveUntil, seat.id as string],
  });

  return NextResponse.json({ success: true, effectiveUntil });
}
