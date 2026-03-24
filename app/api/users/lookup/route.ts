import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import { ensureUserColumns } from "@/lib/ensure-tables";

// GET /api/users/lookup?q=<handle_or_email>
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  await ensureUserColumns();

  const isEmail = q.includes("@");
  const result = await db.execute({
    sql: isEmail
      ? "SELECT id, email, name, handle FROM user WHERE LOWER(email) = LOWER(?)"
      : "SELECT id, email, name, handle FROM user WHERE handle = ?",
    args: [isEmail ? q : q.toLowerCase()],
  });

  if (!result.rows.length) {
    return NextResponse.json(
      { error: isEmail ? "No user found with that email" : "No user found with that handle" },
      { status: 404 }
    );
  }

  const user = result.rows[0];
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    handle: user.handle,
  });
}
