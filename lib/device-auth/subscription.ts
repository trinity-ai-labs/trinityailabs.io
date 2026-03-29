import { db } from "@/lib/db";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";

interface SubscriptionStatus {
  status: string;
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(
  userId: string,
): Promise<SubscriptionStatus | null> {
  await ensureSubscriptionsTable();
  const result = await db.execute({
    sql: "SELECT status, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
    args: [userId],
  });

  if (!result.rows.length) return null;

  const row = result.rows[0];
  return {
    status: row.status as string,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
  };
}

export function isActiveSubscription(status: string): boolean {
  return status === "active" || status === "comp";
}
