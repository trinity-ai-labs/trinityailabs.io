import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import {
  ensureSubscriptionsTable,
  ensureRoleColumn,
} from "@/lib/ensure-tables";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await ensureSubscriptionsTable();

  await ensureRoleColumn();

  const [userResult, subResult] = await Promise.all([
    db.execute({
      sql: `SELECT id, name, email, role, createdAt FROM user WHERE id = ?`,
      args: [id],
    }),
    db.execute({
      sql: `SELECT * FROM subscriptions WHERE user_id = ?`,
      args: [id],
    }),
  ]);

  const user = userResult.rows[0];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user,
    subscription: subResult.rows[0] ?? null,
  });
}
