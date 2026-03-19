import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { cancelSubscription } from "@/lib/lemonsqueezy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await cancelSubscription(id);
  await db.execute({
    sql: `UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE lemonsqueezy_subscription_id = ?`,
    args: [id],
  });

  return NextResponse.json({ ok: true });
}
