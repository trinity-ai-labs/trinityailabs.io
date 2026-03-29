import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import {
  ensureSponsoredSeatsTable,
  ensureSubscriptionsTable,
} from "@/lib/ensure-tables";
import { updateSubscriptionQuantity } from "@/lib/lemonsqueezy";

// DELETE /api/sponsorship/:seatId — stop sponsoring
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ seatId: string }> },
) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { seatId } = await params;
  await ensureSponsoredSeatsTable();
  await ensureSubscriptionsTable();

  // Verify the seat belongs to this user
  const seatResult = await db.execute({
    sql: "SELECT id, sponsor_id, status FROM sponsored_seats WHERE id = ?",
    args: [seatId],
  });

  if (!seatResult.rows.length) {
    return NextResponse.json({ error: "Seat not found" }, { status: 404 });
  }

  const seat = seatResult.rows[0];
  if (seat.sponsor_id !== userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (seat.status === "cancelled") {
    return NextResponse.json(
      { error: "Seat already cancelled" },
      { status: 400 },
    );
  }

  // Get sponsor's subscription to update quantity
  const subResult = await db.execute({
    sql: `SELECT id, lemonsqueezy_subscription_id, seats_purchased
          FROM subscriptions
          WHERE user_id = ? AND status IN ('active', 'comp')
          ORDER BY updated_at DESC LIMIT 1`,
    args: [userId],
  });

  if (subResult.rows.length > 0) {
    const sub = subResult.rows[0];
    const subId = sub.id as string;
    const lsSubId = sub.lemonsqueezy_subscription_id as string | null;
    const currentSeats = (sub.seats_purchased as number) ?? 1;
    const newSeats = Math.max(1, currentSeats - 1);

    if (lsSubId) {
      try {
        await updateSubscriptionQuantity(lsSubId, newSeats);
      } catch (err) {
        console.error("Failed to update Lemon Squeezy quantity:", err);
        return NextResponse.json(
          { error: "Failed to update billing. Please try again." },
          { status: 500 },
        );
      }
    }

    // Update seats_purchased on the matched subscription row
    await db.execute({
      sql: "UPDATE subscriptions SET seats_purchased = ? WHERE id = ?",
      args: [newSeats, subId],
    });
  }

  // Cancel the seat (immediate — no grace period for sponsor-initiated cancellation)
  await db.execute({
    sql: "UPDATE sponsored_seats SET status = 'cancelled', cancelled_at = datetime('now'), cancelled_by = 'sponsor' WHERE id = ?",
    args: [seatId],
  });

  return NextResponse.json({ success: true });
}
