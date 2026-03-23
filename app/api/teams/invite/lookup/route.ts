import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureTeamsTables } from "@/lib/ensure-tables";

// GET /api/teams/invite/lookup?token=... — find team for an invite token
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  await ensureTeamsTables();

  const result = await db.execute({
    sql: `SELECT ti.team_id, t.name as team_name, ti.status, ti.expires_at
          FROM team_invites ti
          JOIN teams t ON t.id = ti.team_id
          WHERE ti.token = ?`,
    args: [token],
  });

  if (!result.rows.length) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const invite = result.rows[0];

  if (invite.status !== "pending") {
    return NextResponse.json(
      { error: `Invite has already been ${invite.status}` },
      { status: 410 }
    );
  }

  if (invite.expires_at && new Date(invite.expires_at as string) < new Date()) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  return NextResponse.json({
    teamId: invite.team_id,
    teamName: invite.team_name,
  });
}
