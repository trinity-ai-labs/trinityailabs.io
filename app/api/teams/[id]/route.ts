import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureTeamsReady, getTeamMembership, isTeamOwner } from "@/lib/teams";
import { deleteDatabase } from "@/lib/turso-admin";

// GET /api/teams/:id — team detail + members
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await ensureTeamsReady();

  const membership = await getTeamMembership(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "Not a member of this team" }, { status: 403 });
  }

  const teamResult = await db.execute({
    sql: "SELECT id, name, slug, avatar_url, owner_id, created_at FROM teams WHERE id = ?",
    args: [id],
  });

  if (!teamResult.rows.length) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const membersResult = await db.execute({
    sql: `SELECT tm.user_id, tm.role, tm.paid_by, tm.joined_at,
            u.name, u.email
          FROM team_members tm
          JOIN user u ON u.id = tm.user_id
          WHERE tm.team_id = ?
          ORDER BY tm.role DESC, tm.joined_at`,
    args: [id],
  });

  const invitesResult = await db.execute({
    sql: `SELECT id, email, paid_by, status, created_at, expires_at
          FROM team_invites
          WHERE team_id = ? AND status = 'pending'
          ORDER BY created_at DESC`,
    args: [id],
  });

  return NextResponse.json({
    team: teamResult.rows[0],
    members: membersResult.rows,
    pendingInvites: invitesResult.rows,
    currentUserRole: membership.role,
  });
}

// PATCH /api/teams/:id — update team settings (owner only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await ensureTeamsReady();

  if (!(await isTeamOwner(id, session.user.id))) {
    return NextResponse.json({ error: "Only the team owner can update settings" }, { status: 403 });
  }

  const body = await req.json();
  const updates: string[] = [];
  const args: (string | null)[] = [];

  if (body.name && typeof body.name === "string") {
    updates.push("name = ?");
    args.push(body.name.trim());
  }
  if (body.avatar_url !== undefined) {
    updates.push("avatar_url = ?");
    args.push(body.avatar_url);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.push("updated_at = datetime('now')");
  args.push(id);

  await db.execute({
    sql: `UPDATE teams SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/teams/:id — delete team (owner only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await ensureTeamsReady();

  if (!(await isTeamOwner(id, session.user.id))) {
    return NextResponse.json({ error: "Only the team owner can delete the team" }, { status: 403 });
  }

  // Get Turso DB name for cleanup
  const teamResult = await db.execute({
    sql: "SELECT turso_db_name FROM teams WHERE id = ?",
    args: [id],
  });

  const tursoDbName = teamResult.rows[0]?.turso_db_name as string | null;

  // Delete team (cascades handled manually since SQLite FK support varies)
  await db.execute({ sql: "DELETE FROM team_members WHERE team_id = ?", args: [id] });
  await db.execute({ sql: "DELETE FROM team_invites WHERE team_id = ?", args: [id] });
  await db.execute({
    sql: "UPDATE subscriptions SET team_id = NULL WHERE team_id = ?",
    args: [id],
  });
  await db.execute({ sql: "DELETE FROM teams WHERE id = ?", args: [id] });

  // Delete Turso DB in background (best-effort)
  if (tursoDbName) {
    deleteDatabase(tursoDbName).catch((err) =>
      console.error("Failed to delete Turso DB:", err)
    );
  }

  return NextResponse.json({ success: true });
}
