import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import { ensureStorageAddonsTable } from "@/lib/ensure-tables";
import { cancelSubscription } from "@/lib/lemonsqueezy";

// DELETE /api/billing/storage-addon/:addonId — cancel a single storage pack
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addonId: string }> },
) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addonId } = await params;
  await ensureStorageAddonsTable();

  const result = await db.execute({
    sql: `SELECT id, purchaser_id, beneficiary_id, lemonsqueezy_subscription_id, status
          FROM storage_addons WHERE id = ?`,
    args: [addonId],
  });

  if (!result.rows.length) {
    return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
  }

  const addon = result.rows[0];

  // Purchaser or beneficiary can cancel
  if (addon.purchaser_id !== userId && addon.beneficiary_id !== userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (addon.status === "cancelled") {
    return NextResponse.json(
      { error: "Add-on already cancelled" },
      { status: 400 },
    );
  }

  const lsSubId = addon.lemonsqueezy_subscription_id as string | null;
  if (lsSubId) {
    try {
      await cancelSubscription(lsSubId);
    } catch (err) {
      console.error("Failed to cancel storage addon subscription:", err);
      return NextResponse.json(
        { error: "Failed to cancel. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true });
}
