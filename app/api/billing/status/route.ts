import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.execute({
      sql: "SELECT status, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      args: [session.user.id],
    });

    if (!result.rows.length) {
      return NextResponse.json(null);
    }

    return NextResponse.json(result.rows[0]);
  } catch {
    // Table may not exist yet
    return NextResponse.json(null);
  }
}
