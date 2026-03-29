import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { ensureBugReportsTables } from "@/lib/ensure-tables";
import { presignDownload } from "@/lib/r2";
import { BUG_REPORT_STATUSES } from "@/lib/bug-reports";

/** GET — Bug report detail with attachments (admin only). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBugReportsTables();
  const { id } = await params;

  const reportResult = await db.execute({
    sql: `SELECT * FROM bug_reports WHERE id = ?`,
    args: [id],
  });

  if (!reportResult.rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const attachmentsResult = await db.execute({
    sql: `SELECT * FROM bug_report_attachments WHERE bug_report_id = ? ORDER BY created_at`,
    args: [id],
  });

  const attachments = await Promise.all(
    attachmentsResult.rows.map(async (att) => ({
      ...att,
      url: await presignDownload(att.storage_key as string),
    })),
  );

  return NextResponse.json({
    report: reportResult.rows[0],
    attachments,
  });
}

/** PATCH — Update bug report status/notes (admin only). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBugReportsTables();
  const { id } = await params;

  const body = await req.json();
  const { status, adminNotes } = body as {
    status?: string;
    adminNotes?: string;
  };

  if (
    status &&
    !BUG_REPORT_STATUSES.includes(
      status as (typeof BUG_REPORT_STATUSES)[number],
    )
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const sets: string[] = ["updated_at = datetime('now')"];
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
    sql: `UPDATE bug_reports SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });

  return NextResponse.json({ updated: true });
}
