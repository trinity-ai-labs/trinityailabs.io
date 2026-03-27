import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { enforceAllQuotas } from "@/lib/quota-enforcement";

// POST /api/admin/enforce-quota — run quota enforcement across all users
// Called by Cloudflare Cron Trigger (daily) or manually by admin
export async function POST(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await enforceAllQuotas();
  return NextResponse.json(result);
}
