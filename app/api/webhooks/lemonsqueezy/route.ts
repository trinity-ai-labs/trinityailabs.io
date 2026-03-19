import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";
import crypto from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
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

  await ensureSubscriptionsTable();

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
