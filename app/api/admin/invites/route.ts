import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { ensureInvitesTable } from "@/lib/ensure-tables";
import { sendInviteEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureInvitesTable();

  const result = await db.execute(
    "SELECT * FROM invites ORDER BY created_at DESC"
  );
  return NextResponse.json({ invites: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, freeAccess } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  await ensureInvitesTable();

  const id = crypto.randomUUID();
  const token = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO invites (id, email, token, free_access, invited_by) VALUES (?, ?, ?, ?, ?)`,
    args: [id, email, token, freeAccess ? 1 : 0, session.user.id],
  });

  const baseUrl = process.env.BETTER_AUTH_URL ?? "https://trinityailabs.com";
  const inviteUrl = `${baseUrl}/signup?invite=${token}`;

  await sendInviteEmail(email, inviteUrl);

  return NextResponse.json({ ok: true, id, token });
}
