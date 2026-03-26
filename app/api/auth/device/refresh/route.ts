import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  consumeRefreshToken,
  createRefreshToken,
  signAccessToken,
  getSubscriptionStatus,
} from "@/lib/device-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { refreshToken } = body;

  if (!refreshToken || typeof refreshToken !== "string") {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 400 },
    );
  }

  const userId = await consumeRefreshToken(refreshToken);
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 },
    );
  }

  // Fetch user info + subscription in parallel
  const [userResult, sub] = await Promise.all([
    db.execute({
      sql: "SELECT id, email, name FROM user WHERE id = ?",
      args: [userId],
    }),
    getSubscriptionStatus(userId),
  ]);

  if (!userResult.rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const user = userResult.rows[0];

  const accessToken = await signAccessToken({
    sub: user.id as string,
    email: user.email as string,
    name: user.name as string,
    subscription: sub?.status ?? null,
  });

  const newRefreshToken = await createRefreshToken(userId);

  return NextResponse.json({
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: 86400,
  });
}
