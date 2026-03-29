import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureBetaSignupsTable } from "@/lib/ensure-tables";
import { sendBetaSignupNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name } = body as { email?: string; name?: string };

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email required" },
      { status: 400 },
    );
  }

  await ensureBetaSignupsTable();

  const existing = await db.execute({
    sql: "SELECT id, status FROM beta_signups WHERE email = ?",
    args: [email.toLowerCase()],
  });

  if (existing.rows.length > 0) {
    return NextResponse.json({
      ok: true,
      message: "You've already signed up — we'll be in touch!",
    });
  }

  const id = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO beta_signups (id, email, name) VALUES (?, ?, ?)`,
    args: [id, email.toLowerCase(), name?.trim() || null],
  });

  try {
    await sendBetaSignupNotificationEmail({
      email: email.toLowerCase(),
      name: name?.trim() ?? null,
    });
  } catch {
    // Don't fail the signup if admin notification fails
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks for signing up! We'll review your application shortly.",
  });
}
