import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccessToken,
  getSubscriptionStatus,
} from "@/lib/device-auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyAccessToken(token);

    // Always fetch live subscription status from DB
    const sub = await getSubscriptionStatus(payload.sub!);

    return NextResponse.json({
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      },
      subscription: sub
        ? { status: sub.status, currentPeriodEnd: sub.currentPeriodEnd }
        : null,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 });
  }
}
