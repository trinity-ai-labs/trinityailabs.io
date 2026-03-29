import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserColumns } from "@/lib/ensure-tables";

// POST /api/handle/resolve — resolve handle to email for login
export async function POST(req: NextRequest) {
  const body = await req.json();
  const handle = (body.handle as string)?.toLowerCase().trim();
  if (!handle)
    return NextResponse.json({ error: "Handle required" }, { status: 400 });

  await ensureUserColumns();

  const result = await db.execute({
    sql: "SELECT email FROM user WHERE handle = ?",
    args: [handle],
  });

  if (!result.rows.length)
    return NextResponse.json(
      { error: "No account found with that handle" },
      { status: 404 },
    );

  return NextResponse.json({ email: result.rows[0].email as string });
}
