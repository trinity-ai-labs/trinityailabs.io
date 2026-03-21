import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureTeamsReady } from "@/lib/teams";
import { createDatabaseToken } from "@/lib/turso-admin";

// POST /api/teams/:id/invite/accept — accept a team invite
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId } = await params;
  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ error: "Invite token is required" }, { status: 400 });
  }

  await ensureTeamsReady();

  // Find and validate invite
  const inviteResult = await db.execute({
    sql: `SELECT id, email, paid_by, expires_at
          FROM team_invites
          WHERE team_id = ? AND token = ? AND status = 'pending'`,
    args: [teamId, token],
  });

  if (!inviteResult.rows.length) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }

  const invite = inviteResult.rows[0];

  // Check expiry
  if (invite.expires_at && new Date(invite.expires_at as string) < new Date()) {
    await db.execute({
      sql: "UPDATE team_invites SET status = 'expired' WHERE id = ?",
      args: [invite.id],
    });
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  // Check email matches (case-insensitive)
  if ((invite.email as string).toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "This invite was sent to a different email address" },
      { status: 403 }
    );
  }

  // Check not already a member
  const existingMember = await db.execute({
    sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
    args: [teamId, session.user.id],
  });
  if (existingMember.rows.length > 0) {
    return NextResponse.json({ error: "You are already a member of this team" }, { status: 409 });
  }

  // Generate Turso token for new member
  const teamResult = await db.execute({
    sql: "SELECT turso_db_name FROM teams WHERE id = ?",
    args: [teamId],
  });
  let tursoToken: string | null = null;
  const tursoDbName = teamResult.rows[0]?.turso_db_name as string | null;
  if (tursoDbName) {
    try {
      tursoToken = await createDatabaseToken(tursoDbName);
    } catch {
      // Token can be generated later
    }
  }

  // Add member
  await db.execute({
    sql: `INSERT INTO team_members (team_id, user_id, role, paid_by, turso_token)
          VALUES (?, ?, 'member', ?, ?)`,
    args: [teamId, session.user.id, invite.paid_by, tursoToken],
  });

  // Mark invite as accepted
  await db.execute({
    sql: "UPDATE team_invites SET status = 'accepted' WHERE id = ?",
    args: [invite.id],
  });

  return NextResponse.json({ success: true });
}
