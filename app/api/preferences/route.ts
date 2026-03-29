import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { ensureUserPreferencesTable } from "@/lib/ensure-tables";

/** GET — read all preferences for the current user. */
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserPreferencesTable();

  const result = await db.execute({
    sql: "SELECT key, value FROM user_preferences WHERE user_id = ?",
    args: [session.user.id],
  });

  const prefs: Record<string, string> = {};
  for (const row of result.rows) {
    prefs[row.key as string] = row.value as string;
  }

  return NextResponse.json({ preferences: prefs });
}

/** PUT — upsert preferences for the current user. Body: { key: value, ... } */
export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Body must be an object of key-value pairs" },
      { status: 400 },
    );
  }

  await ensureUserPreferencesTable();

  const entries = Object.entries(body);
  for (const [key, value] of entries) {
    if (typeof key !== "string") continue;
    await db.execute({
      sql: `INSERT INTO user_preferences (user_id, key, value, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
      args: [session.user.id, key, String(value), String(value)],
    });
  }

  return NextResponse.json({ success: true });
}
