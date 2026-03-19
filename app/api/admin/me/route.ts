import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ isAdmin: true });
}
