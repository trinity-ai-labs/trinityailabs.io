import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureTeamsReady, isTeamOwner, generateId, generateToken } from "@/lib/teams";
import { sendTeamInviteEmail } from "@/lib/email";

// POST /api/teams/:id/invite — invite a member
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId } = await params;
  await ensureTeamsReady();

  if (!(await isTeamOwner(teamId, session.user.id))) {
    return NextResponse.json({ error: "Only the team owner can invite members" }, { status: 403 });
  }

  const body = await req.json();
  const { email } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if already a member
  const existingUser = await db.execute({
    sql: "SELECT id FROM user WHERE email = ?",
    args: [normalizedEmail],
  });
  if (existingUser.rows.length > 0) {
    const existingMember = await db.execute({
      sql: "SELECT user_id FROM team_members WHERE team_id = ? AND user_id = ?",
      args: [teamId, existingUser.rows[0].id],
    });
    if (existingMember.rows.length > 0) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 409 });
    }
  }

  // Check for pending invite
  const pendingInvite = await db.execute({
    sql: "SELECT id FROM team_invites WHERE team_id = ? AND email = ? AND status = 'pending'",
    args: [teamId, normalizedEmail],
  });
  if (pendingInvite.rows.length > 0) {
    return NextResponse.json({ error: "An invite is already pending for this email" }, { status: 409 });
  }

  const inviteId = generateId();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await db.execute({
    sql: `INSERT INTO team_invites (id, team_id, email, invited_by, token, status, expires_at)
          VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
    args: [inviteId, teamId, normalizedEmail, session.user.id, token, expiresAt],
  });

  // Get team name for the email
  const teamResult = await db.execute({
    sql: "SELECT name FROM teams WHERE id = ?",
    args: [teamId],
  });
  const teamName = (teamResult.rows[0]?.name as string) ?? "a team";

  const acceptUrl = `${process.env.BETTER_AUTH_URL ?? "https://trinityailabs.com"}/teams/invite?token=${token}`;

  await sendTeamInviteEmail(
    normalizedEmail,
    teamName,
    session.user.name ?? "Someone",
    acceptUrl
  );

  return NextResponse.json({ id: inviteId }, { status: 201 });
}
