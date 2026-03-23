import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureUserColumns } from "@/lib/ensure-tables";

// GET /api/handle/me — get current user's handle
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureUserColumns();

  const result = await db.execute({
    sql: "SELECT handle FROM user WHERE id = ?",
    args: [session.user.id],
  });

  return NextResponse.json({
    handle: (result.rows[0]?.handle as string) ?? null,
  });
}
