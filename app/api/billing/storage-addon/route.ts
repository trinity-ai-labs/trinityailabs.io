import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import {
  ensureStorageAddonsTable,
  ensureUserColumns,
} from "@/lib/ensure-tables";

// GET /api/billing/storage-addon — list user's storage add-ons
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await Promise.all([ensureStorageAddonsTable(), ensureUserColumns()]);

  const result = await db.execute({
    sql: `SELECT sa.id, sa.purchaser_id, sa.beneficiary_id, sa.status,
            sa.current_period_end, sa.created_at,
            pu.name AS purchaser_name, pu.email AS purchaser_email,
            bu.name AS beneficiary_name, bu.email AS beneficiary_email
          FROM storage_addons sa
          LEFT JOIN user pu ON pu.id = sa.purchaser_id
          LEFT JOIN user bu ON bu.id = sa.beneficiary_id
          WHERE (sa.purchaser_id = ? OR sa.beneficiary_id = ?)
            AND (sa.status = 'active'
              OR (sa.status = 'cancelled' AND sa.current_period_end > datetime('now')))
          ORDER BY sa.created_at DESC`,
    args: [userId, userId],
  });

  const addons = result.rows.map((row) => {
    const purchaserId = row.purchaser_id as string;
    const beneficiaryId = row.beneficiary_id as string;
    let type: "self" | "gifted" | "received";

    if (purchaserId === userId && beneficiaryId === userId) {
      type = "self";
    } else if (purchaserId === userId) {
      type = "gifted";
    } else {
      type = "received";
    }

    return {
      id: row.id,
      type,
      status: row.status,
      currentPeriodEnd: row.current_period_end ?? null,
      createdAt: row.created_at,
      purchaserName: row.purchaser_name ?? null,
      purchaserEmail: row.purchaser_email ?? null,
      beneficiaryName: row.beneficiary_name ?? null,
      beneficiaryEmail: row.beneficiary_email ?? null,
    };
  });

  return NextResponse.json({ addons });
}
