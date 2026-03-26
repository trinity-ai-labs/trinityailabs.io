import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserPreferencesTable } from "@/lib/ensure-tables";
import { requireAccessToken } from "@/lib/device-auth";

// PUT /api/workspace/preferences — update user preferences
export async function PUT(req: Request) {
  let payload;
  try {
    payload = await requireAccessToken(req);
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid access token" },
      { status: 401 },
    );
  }

  const userId = payload.sub!;
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
      args: [userId, key, String(value), String(value)],
    });
  }

  return NextResponse.json({ success: true });
}
