import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  consumeDeviceCode,
  getDeviceCodeStatus,
  signAccessToken,
  createRefreshToken,
  getSubscriptionStatus,
} from "@/lib/device-auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const status = await getDeviceCodeStatus(code);

  if (status === "not_found") {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  if (status === "expired") {
    return NextResponse.json({ status: "expired" }, { status: 410 });
  }

  if (status === "used") {
    return NextResponse.json({ error: "Code already used" }, { status: 400 });
  }

  if (status === "pending") {
    return NextResponse.json({ status: "pending" });
  }

  // Status is "approved" — consume and mint tokens
  const userId = await consumeDeviceCode(code);
  if (!userId) {
    return NextResponse.json({ error: "Failed to consume code" }, { status: 500 });
  }

  // Fetch user info
  const userResult = await db.execute({
    sql: "SELECT id, email, name FROM user WHERE id = ?",
    args: [userId],
  });

  if (!userResult.rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const user = userResult.rows[0];
  const sub = await getSubscriptionStatus(userId);

  const accessToken = await signAccessToken({
    sub: user.id as string,
    email: user.email as string,
    name: user.name as string,
    subscription: sub?.status ?? null,
  });

  const refreshToken = await createRefreshToken(userId);

  return NextResponse.json({
    status: "approved",
    accessToken,
    refreshToken,
    expiresIn: 86400,
  });
}
