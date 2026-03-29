import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  ensureTeamsReady,
  generateSlug,
  generateId,
  generateEncryptionKey,
  provisionTursoDb,
} from "@/lib/teams";
import { createDatabaseToken } from "@/lib/turso-admin";

// POST /api/teams — create a new team
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Team name must be at least 2 characters" },
      { status: 400 },
    );
  }

  await ensureTeamsReady();

  const id = generateId();
  const slug = generateSlug(name.trim());
  const encryptionKey = generateEncryptionKey();

  // Check slug uniqueness
  const existing = await db.execute({
    sql: "SELECT id FROM teams WHERE slug = ?",
    args: [slug],
  });
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "A team with a similar name already exists" },
      { status: 409 },
    );
  }

  // Provision Turso DB for the team
  const dbName = `trinity-team-${slug}-${id.slice(0, 8)}`;
  let tursoDbName: string | null = null;
  let tursoDbUrl: string | null = null;

  try {
    const result = await provisionTursoDb(dbName);
    tursoDbName = result.dbName;
    tursoDbUrl = result.dbUrl;
  } catch (err) {
    console.error("Turso provisioning failed:", err);
    // Team is created without DB — provisioning can be retried
  }

  // Create team
  await db.execute({
    sql: `INSERT INTO teams (id, name, slug, turso_db_name, turso_db_url, encryption_key, owner_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      name.trim(),
      slug,
      tursoDbName,
      tursoDbUrl,
      encryptionKey,
      session.user.id,
    ],
  });

  // Add owner as member with Turso token
  let ownerToken: string | null = null;
  if (tursoDbName) {
    try {
      ownerToken = await createDatabaseToken(tursoDbName);
    } catch {
      // Token generation can be retried
    }
  }

  await db.execute({
    sql: `INSERT INTO team_members (team_id, user_id, role, turso_token)
          VALUES (?, ?, 'owner', ?)`,
    args: [id, session.user.id, ownerToken],
  });

  return NextResponse.json({ id, name: name.trim(), slug }, { status: 201 });
}

// GET /api/teams — list user's teams
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureTeamsReady();

  const result = await db.execute({
    sql: `SELECT t.id, t.name, t.slug, t.avatar_url, tm.role,
            (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
          FROM teams t
          JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
          ORDER BY t.name`,
    args: [session.user.id],
  });

  return NextResponse.json({ teams: result.rows });
}
