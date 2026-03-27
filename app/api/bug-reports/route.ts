import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import {
  requireAccessToken,
  AccessTokenError,
} from "@/lib/device-auth/require-access-token";
import { ensureBugReportsTables } from "@/lib/ensure-tables";
import { sendBugReportEmail } from "@/lib/email";

const PAGE_SIZE = 20;

/** POST — Create a new bug report (device auth). */
export async function POST(req: NextRequest) {
  let token;
  try {
    token = await requireAccessToken(req);
  } catch (err) {
    if (err instanceof AccessTokenError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  await ensureBugReportsTables();

  const body = await req.json();
  const { title, description, appVersion, os, route, attachments } = body as {
    title: string;
    description: string;
    appVersion?: string;
    os?: string;
    route?: string;
    attachments?: {
      id: string;
      fileName: string;
      storageKey: string;
      contentType: string;
      fileSize: number;
    }[];
  };

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const userId = token.sub ?? "";

  await db.execute({
    sql: `INSERT INTO bug_reports (id, user_id, user_email, user_name, title, description, app_version, os, route)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      userId,
      token.email,
      token.name ?? null,
      title.trim(),
      description.trim(),
      appVersion ?? null,
      os ?? null,
      route ?? null,
    ],
  });

  if (attachments?.length) {
    await Promise.all(
      attachments.map((att) =>
        db.execute({
          sql: `INSERT INTO bug_report_attachments (id, bug_report_id, file_name, storage_key, content_type, file_size)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [
            att.id,
            id,
            att.fileName,
            att.storageKey,
            att.contentType,
            att.fileSize,
          ],
        }),
      ),
    );
  }

  // Fire-and-forget email notification
  sendBugReportEmail({
    id,
    title: title.trim(),
    description: description.trim(),
    userEmail: token.email,
    userName: token.name ?? null,
    appVersion: appVersion ?? null,
    os: os ?? null,
  }).catch(() => {
    // Email failure should not break the request
  });

  return NextResponse.json({ id }, { status: 201 });
}

/** GET — List bug reports (admin only). */
export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBugReportsTables();

  const status = req.nextUrl.searchParams.get("status");
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const conditions: string[] = [];
  const args: (string | number)[] = [];

  if (status) {
    conditions.push("status = ?");
    args.push(status);
  }

  if (search) {
    conditions.push("(title LIKE ? OR user_email LIKE ?)");
    args.push(`%${search}%`, `%${search}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countResult, reportsResult] = await Promise.all([
    db.execute({
      sql: `SELECT COUNT(*) as count FROM bug_reports ${whereClause}`,
      args,
    }),
    db.execute({
      sql: `SELECT id, title, user_email, user_name, status, app_version, os, route, created_at, updated_at
            FROM bug_reports ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
      args: [...args, PAGE_SIZE, offset],
    }),
  ]);

  return NextResponse.json({
    reports: reportsResult.rows,
    total: Number(countResult.rows[0]?.count ?? 0),
    page,
    pageSize: PAGE_SIZE,
  });
}
