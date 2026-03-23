import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureTeamsReady, isTeamOwner } from "@/lib/teams";

// DELETE /api/teams/:id/members/:userId — remove member (owner only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId, userId } = await params;
  await ensureTeamsReady();

  if (!(await isTeamOwner(teamId, session.user.id))) {
    return NextResponse.json({ error: "Only the team owner can remove members" }, { status: 403 });
  }

  // Can't remove the owner
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot remove yourself as owner. Transfer ownership first." }, { status: 400 });
  }

  const result = await db.execute({
    sql: "DELETE FROM team_members WHERE team_id = ? AND user_id = ?",
    args: [teamId, userId],
  });

  if (!result.rowsAffected) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// PATCH /api/teams/:id/members/:userId — transfer ownership (owner only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId, userId } = await params;
  const body = await req.json();
  await ensureTeamsReady();

  if (!(await isTeamOwner(teamId, session.user.id))) {
    return NextResponse.json({ error: "Only the team owner can transfer ownership" }, { status: 403 });
  }

  if (body.role === "owner") {
    // Transfer ownership: current owner becomes member, target becomes owner
    await db.execute({
      sql: "UPDATE team_members SET role = 'member' WHERE team_id = ? AND user_id = ?",
      args: [teamId, session.user.id],
    });
    await db.execute({
      sql: "UPDATE team_members SET role = 'owner' WHERE team_id = ? AND user_id = ?",
      args: [teamId, userId],
    });
    await db.execute({
      sql: "UPDATE teams SET owner_id = ?, updated_at = datetime('now') WHERE id = ?",
      args: [userId, teamId],
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid role" }, { status: 400 });
}
