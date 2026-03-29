import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCustomerPortalUrl } from "@/lib/lemonsqueezy";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute({
    sql: "SELECT lemonsqueezy_customer_id FROM subscriptions WHERE user_id = ? AND lemonsqueezy_customer_id IS NOT NULL ORDER BY created_at DESC LIMIT 1",
    args: [session.user.id],
  });

  if (!result.rows.length || !result.rows[0].lemonsqueezy_customer_id) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 404 },
    );
  }

  const url = await createCustomerPortalUrl(
    result.rows[0].lemonsqueezy_customer_id as string,
  );
  return NextResponse.json({ url });
}
