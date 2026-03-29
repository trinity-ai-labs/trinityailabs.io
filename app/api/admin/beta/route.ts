import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { ensureBetaSignupsTable } from "@/lib/ensure-tables";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBetaSignupsTable();

  const status = req.nextUrl.searchParams.get("status");

  const sql = status
    ? "SELECT * FROM beta_signups WHERE status = ? ORDER BY created_at DESC"
    : "SELECT * FROM beta_signups ORDER BY created_at DESC";
  const args = status ? [status] : [];

  const result = await db.execute({ sql, args });
  return NextResponse.json({ signups: result.rows });
}
