import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureInvitesTable, ensureSubscriptionsTable } from "@/lib/ensure-tables";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  await ensureInvitesTable();

  const result = await db.execute({
    sql: `SELECT email, free_access FROM invites WHERE token = ? AND used = 0`,
    args: [token],
  });

  const invite = result.rows[0];
  if (!invite) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  return NextResponse.json({
    email: invite.email,
    freeAccess: !!invite.free_access,
  });
}

export async function POST(req: NextRequest) {
  const { token, userId } = await req.json();
  if (!token || !userId) {
    return NextResponse.json(
      { error: "Token and userId required" },
      { status: 400 }
    );
  }

  await ensureInvitesTable();

  const result = await db.execute({
    sql: `SELECT * FROM invites WHERE token = ? AND used = 0`,
    args: [token],
  });

  const invite = result.rows[0];
  if (!invite) {
    return NextResponse.json(
      { error: "Invalid or already used invite" },
      { status: 400 }
    );
  }

  await db.execute({
    sql: `UPDATE invites SET used = 1 WHERE id = ?`,
    args: [invite.id],
  });

  if (invite.free_access) {
    await ensureSubscriptionsTable();
    const compId = `comp_${userId}`;
    await db.execute({
      sql: `INSERT INTO subscriptions (id, user_id, status, created_at, updated_at)
            VALUES (?, ?, 'comp', datetime('now'), datetime('now'))
            ON CONFLICT(id) DO UPDATE SET status = 'comp', updated_at = datetime('now')`,
      args: [compId, userId],
    });
  }

  return NextResponse.json({ ok: true, freeAccess: !!invite.free_access });
}
