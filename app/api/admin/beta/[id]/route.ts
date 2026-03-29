import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import {
  ensureBetaSignupsTable,
  ensureInvitesTable,
} from "@/lib/ensure-tables";
import { sendInviteEmail, sendBetaRejectionEmail } from "@/lib/email";

const VALID_STATUSES = ["pending", "approved", "rejected"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBetaSignupsTable();
  const { id } = await params;

  const body = await req.json();
  const { status, adminNotes } = body as {
    status?: string;
    adminNotes?: string;
  };

  if (
    status &&
    !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Get the signup first
  const signupResult = await db.execute({
    sql: "SELECT * FROM beta_signups WHERE id = ?",
    args: [id],
  });

  if (!signupResult.rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const signup = signupResult.rows[0];

  const sets: string[] = ["reviewed_at = datetime('now')"];
  const args: (string | number)[] = [];

  if (status) {
    sets.push("status = ?");
    args.push(status);
  }
  if (adminNotes !== undefined) {
    sets.push("admin_notes = ?");
    args.push(adminNotes);
  }

  args.push(id);

  await db.execute({
    sql: `UPDATE beta_signups SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });

  const email = signup.email as string;

  // Handle approval — create invite with free access + send invite email
  if (status === "approved" && signup.status !== "approved") {
    await ensureInvitesTable();

    const inviteId = crypto.randomUUID();
    const token = crypto.randomUUID();

    await db.execute({
      sql: `INSERT INTO invites (id, email, token, free_access, invited_by) VALUES (?, ?, ?, 1, ?)`,
      args: [inviteId, email, token, session.user.id],
    });

    const baseUrl =
      process.env.BETTER_AUTH_URL ?? "https://trinityailabs.com";
    const inviteUrl = `${baseUrl}/signup?invite=${token}`;

    try {
      await sendInviteEmail(email, inviteUrl);
    } catch {
      // Don't fail the approval if email fails
    }
  }

  // Handle rejection — send rejection email
  if (status === "rejected" && signup.status !== "rejected") {
    try {
      await sendBetaRejectionEmail(email);
    } catch {
      // Don't fail the rejection if email fails
    }
  }

  return NextResponse.json({ updated: true });
}
