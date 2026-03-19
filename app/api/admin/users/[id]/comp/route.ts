import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { ensureSubscriptionsTable } from "@/lib/ensure-tables";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await ensureSubscriptionsTable();

  const compId = `comp_${id}`;
  await db.execute({
    sql: `INSERT INTO subscriptions (id, user_id, status, created_at, updated_at)
          VALUES (?, ?, 'comp', datetime('now'), datetime('now'))
          ON CONFLICT(id) DO UPDATE SET status = 'comp', updated_at = datetime('now')`,
    args: [compId, id],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db.execute({
    sql: `DELETE FROM subscriptions WHERE id = ? AND status = 'comp'`,
    args: [`comp_${id}`],
  });

  return NextResponse.json({ ok: true });
}
