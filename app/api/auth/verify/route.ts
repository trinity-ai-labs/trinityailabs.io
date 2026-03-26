import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken, getSubscriptionStatus } from "@/lib/device-auth";

export async function GET(request: NextRequest) {
  try {
    const payload = await requireAccessToken(request);

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
    return NextResponse.json(
      { valid: false, error: "Invalid token" },
      { status: 401 },
    );
  }
}
