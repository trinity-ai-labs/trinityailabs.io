import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureSubscriptionsTable,
  ensureStorageAddonsTable,
  ensureSponsoredSeatsTable,
} from "@/lib/ensure-tables";
import { updateSubscriptionQuantity } from "@/lib/lemonsqueezy";
import crypto from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/** Handle webhook events for the storage add-on product */
async function handleStorageAddonEvent(
  eventName: string,
  event: Record<string, unknown>,
  attrs: Record<string, unknown>,
  userId: string | undefined,
) {
  const subId = String((event.data as Record<string, unknown>).id);
  const customData = (event.meta as Record<string, unknown>).custom_data as
    | Record<string, string>
    | undefined;

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
    case "subscription_resumed": {
      const customerId = String(attrs.customer_id);
      const status =
        attrs.status === "active" ? "active" : String(attrs.status);
      const periodEnd = (attrs.renews_at as string) ?? null;
      const purchaserId = userId ?? "";
      const beneficiaryId = customData?.beneficiary_id ?? purchaserId;

      await db.execute({
        sql: `INSERT INTO storage_addons
                (id, purchaser_id, beneficiary_id, lemonsqueezy_subscription_id, lemonsqueezy_customer_id, status, current_period_end, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
              ON CONFLICT(id) DO UPDATE SET
                status = excluded.status,
                current_period_end = excluded.current_period_end,
                updated_at = datetime('now')`,
        args: [
          subId,
          purchaserId,
          beneficiaryId,
          subId,
          customerId,
          status,
          periodEnd,
        ],
      });
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      await db.execute({
        sql: `UPDATE storage_addons SET status = 'cancelled', updated_at = datetime('now')
              WHERE lemonsqueezy_subscription_id = ?`,
        args: [subId],
      });
      break;
    }

    case "subscription_payment_success":
    case "subscription_payment_failed": {
      const lsSubId = String(attrs.subscription_id);
      const status =
        eventName === "subscription_payment_failed" ? "past_due" : "active";
      await db.execute({
        sql: `UPDATE storage_addons SET status = ?, updated_at = datetime('now')
              WHERE lemonsqueezy_subscription_id = ?`,
        args: [status, lsSubId],
      });
      break;
    }
  }
}

/** Auto-cancel any active sponsored seat when a user creates their own subscription */
async function autoCancelSponsoredSeat(userId: string) {
  const seatResult = await db.execute({
    sql: `SELECT ss.id, ss.sponsor_id, s.id AS sub_id,
            s.lemonsqueezy_subscription_id, s.seats_purchased
          FROM sponsored_seats ss
          JOIN subscriptions s ON s.user_id = ss.sponsor_id
            AND s.status IN ('active', 'comp')
          WHERE ss.user_id = ? AND ss.status = 'active'
          LIMIT 1`,
    args: [userId],
  });

  if (!seatResult.rows.length) return;

  const seat = seatResult.rows[0];
  const lsSubId = seat.lemonsqueezy_subscription_id as string | null;
  const currentSeats = (seat.seats_purchased as number) ?? 1;
  const newSeats = Math.max(1, currentSeats - 1);

  if (lsSubId) {
    try {
      await updateSubscriptionQuantity(lsSubId, newSeats);
    } catch (err) {
      console.error("Failed to decrement sponsor seat count:", err);
    }
  }

  await db.execute({
    sql: "UPDATE subscriptions SET seats_purchased = ? WHERE id = ?",
    args: [newSeats, seat.sub_id as string],
  });

  await db.execute({
    sql: `UPDATE sponsored_seats
          SET status = 'cancelled', cancelled_at = datetime('now'), cancelled_by = 'user'
          WHERE id = ?`,
    args: [seat.id as string],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature");

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventName = event.meta.event_name;
  const attrs = event.data.attributes;
  const userId = event.meta.custom_data?.user_id;

  await Promise.all([
    ensureSubscriptionsTable(),
    ensureStorageAddonsTable(),
    ensureSponsoredSeatsTable(),
  ]);

  // Route storage add-on events to separate handler
  const variantId = String(attrs.variant_id ?? "");
  const isStorageAddon =
    variantId === process.env.LEMONSQUEEZY_STORAGE_ADDON_VARIANT_ID;

  if (isStorageAddon) {
    await handleStorageAddonEvent(eventName, event, attrs, userId);
    return NextResponse.json({ ok: true });
  }

  // Main subscription events
  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
    case "subscription_resumed": {
      const subId = String(event.data.id);
      const customerId = String(attrs.customer_id);
      const status = attrs.status === "active" ? "active" : attrs.status;
      const periodEnd = attrs.renews_at;

      await db.execute({
        sql: `INSERT INTO subscriptions (id, user_id, lemonsqueezy_subscription_id, lemonsqueezy_customer_id, status, current_period_end, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
              ON CONFLICT(id) DO UPDATE SET
                status = excluded.status,
                current_period_end = excluded.current_period_end,
                updated_at = datetime('now')`,
        args: [
          subId,
          userId ?? "",
          subId,
          customerId,
          status,
          periodEnd ?? null,
        ],
      });

      // Auto-cancel sponsored seat when user creates their own subscription
      if (eventName === "subscription_created" && userId) {
        await autoCancelSponsoredSeat(userId);
      }
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      const subId = String(event.data.id);
      await db.execute({
        sql: `UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE lemonsqueezy_subscription_id = ?`,
        args: [subId],
      });
      break;
    }

    case "subscription_payment_success":
    case "subscription_payment_failed": {
      const subId = String(attrs.subscription_id);
      const status =
        eventName === "subscription_payment_failed" ? "past_due" : "active";
      await db.execute({
        sql: `UPDATE subscriptions SET status = ?, updated_at = datetime('now') WHERE lemonsqueezy_subscription_id = ?`,
        args: [status, subId],
      });
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
