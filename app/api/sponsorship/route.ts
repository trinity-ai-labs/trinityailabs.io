import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/device-auth";
import {
  ensureSponsoredSeatsTable,
  ensureSubscriptionsTable,
  ensureUserColumns,
} from "@/lib/ensure-tables";
import { updateSubscriptionQuantity } from "@/lib/lemonsqueezy";

// GET /api/sponsorship — list seats I'm sponsoring
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await Promise.all([ensureSponsoredSeatsTable(), ensureUserColumns()]);

  const result = await db.execute({
    sql: `SELECT ss.id, ss.user_id, ss.status, ss.created_at,
            u.name AS user_name, u.email AS user_email, u.handle AS user_handle
          FROM sponsored_seats ss
          JOIN user u ON u.id = ss.user_id
          WHERE ss.sponsor_id = ? AND ss.status = 'active'
          ORDER BY ss.created_at DESC`,
    args: [userId],
  });

  return NextResponse.json({
    seats: result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      userHandle: row.user_handle,
      status: row.status,
      createdAt: row.created_at,
    })),
  });
}

// POST /api/sponsorship — sponsor a user
export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { handleOrEmail } = body;

  if (!handleOrEmail || typeof handleOrEmail !== "string") {
    return NextResponse.json(
      { error: "handleOrEmail is required" },
      { status: 400 },
    );
  }

  await Promise.all([
    ensureSponsoredSeatsTable(),
    ensureSubscriptionsTable(),
    ensureUserColumns(),
  ]);

  const value = handleOrEmail.trim();
  const isEmail = value.includes("@");

  // Look up the target user
  const userResult = await db.execute({
    sql: isEmail
      ? "SELECT id, email, name, handle FROM user WHERE LOWER(email) = LOWER(?)"
      : "SELECT id, email, name, handle FROM user WHERE handle = ?",
    args: [isEmail ? value : value.toLowerCase()],
  });

  if (!userResult.rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const targetUser = userResult.rows[0];
  const targetUserId = targetUser.id as string;

  if (targetUserId === userId) {
    return NextResponse.json(
      { error: "You cannot sponsor yourself" },
      { status: 400 },
    );
  }

  // Check if already sponsored by this user
  const existing = await db.execute({
    sql: "SELECT id FROM sponsored_seats WHERE sponsor_id = ? AND user_id = ? AND status = 'active'",
    args: [userId, targetUserId],
  });

  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "You are already sponsoring this user" },
      { status: 409 },
    );
  }

  // Get sponsor's subscription to update quantity
  const subResult = await db.execute({
    sql: `SELECT id, lemonsqueezy_subscription_id, seats_purchased
          FROM subscriptions
          WHERE user_id = ? AND status IN ('active', 'comp')
          ORDER BY updated_at DESC LIMIT 1`,
    args: [userId],
  });

  if (!subResult.rows.length) {
    return NextResponse.json(
      { error: "You need an active subscription to sponsor seats" },
      { status: 402 },
    );
  }

  const sub = subResult.rows[0];
  const subId = sub.id as string;
  const lsSubId = sub.lemonsqueezy_subscription_id as string | null;
  const currentSeats = (sub.seats_purchased as number) ?? 1;
  const newSeats = currentSeats + 1;

  // Update Lemon Squeezy quantity (skip for comp subscriptions)
  if (lsSubId) {
    try {
      await updateSubscriptionQuantity(lsSubId, newSeats);
    } catch (err) {
      console.error("Failed to update Lemon Squeezy quantity:", err);
      return NextResponse.json(
        { error: "Failed to update billing. Please try again." },
        { status: 500 },
      );
    }
  }

  // Create sponsored seat
  const seatId = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO sponsored_seats (id, sponsor_id, user_id) VALUES (?, ?, ?)",
    args: [seatId, userId, targetUserId],
  });

  // Update seats_purchased on the matched subscription row
  await db.execute({
    sql: "UPDATE subscriptions SET seats_purchased = ? WHERE id = ?",
    args: [newSeats, subId],
  });

  return NextResponse.json(
    {
      id: seatId,
      userId: targetUserId,
      userName: targetUser.name,
      userEmail: targetUser.email,
      userHandle: targetUser.handle,
      status: "active",
    },
    { status: 201 },
  );
}
