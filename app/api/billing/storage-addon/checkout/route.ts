import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import {
  ensureSubscriptionsTable,
  ensureSponsoredSeatsTable,
  ensureStorageAddonsTable,
} from "@/lib/ensure-tables";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

// POST /api/billing/storage-addon/checkout — create a storage add-on checkout
export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const beneficiaryId = (body.beneficiaryId as string | undefined) ?? userId;

  await Promise.all([
    ensureSubscriptionsTable(),
    ensureSponsoredSeatsTable(),
    ensureStorageAddonsTable(),
  ]);

  // Get user's email for checkout
  const userResult = await db.execute({
    sql: "SELECT email FROM user WHERE id = ?",
    args: [userId],
  });

  if (!userResult.rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const email = userResult.rows[0].email as string;

  // If gifting to someone else, verify sponsor relationship
  if (beneficiaryId !== userId) {
    const subResult = await db.execute({
      sql: `SELECT id FROM subscriptions
            WHERE user_id = ? AND status IN ('active', 'comp')
            ORDER BY updated_at DESC LIMIT 1`,
      args: [userId],
    });

    if (!subResult.rows.length) {
      return NextResponse.json(
        { error: "You need an active subscription to gift storage" },
        { status: 402 },
      );
    }

    const seatResult = await db.execute({
      sql: `SELECT id FROM sponsored_seats
            WHERE sponsor_id = ? AND user_id = ? AND status = 'active'`,
      args: [userId, beneficiaryId],
    });

    if (!seatResult.rows.length) {
      return NextResponse.json(
        { error: "You can only gift storage to users you sponsor" },
        { status: 403 },
      );
    }
  }

  // Check for trial bridge — if beneficiary is currently sponsored, align billing
  let trialEndsAt: string | undefined;
  const sponsorResult = await db.execute({
    sql: `SELECT s.current_period_end
          FROM sponsored_seats ss
          JOIN subscriptions s ON s.user_id = ss.sponsor_id
            AND s.status IN ('active', 'comp')
          WHERE ss.user_id = ?
            AND (ss.status = 'active'
              OR (ss.status = 'cancelled' AND ss.effective_until > datetime('now')))
          LIMIT 1`,
    args: [beneficiaryId],
  });

  if (sponsorResult.rows.length) {
    const periodEnd = sponsorResult.rows[0].current_period_end as string | null;
    if (periodEnd && new Date(periodEnd) > new Date()) {
      trialEndsAt = periodEnd;
    }
  }

  const url = await createCheckoutUrl(email, userId, {
    variantId: process.env.LEMONSQUEEZY_STORAGE_ADDON_VARIANT_ID,
    trialEndsAt,
    customData: { beneficiary_id: beneficiaryId },
  });

  return NextResponse.json({ url, trialEndsAt: trialEndsAt ?? null });
}
