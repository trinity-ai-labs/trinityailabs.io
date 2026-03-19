import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import {
  ensureSubscriptionsTable,
  ensureRoleColumn,
} from "@/lib/ensure-tables";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Promise.all([ensureSubscriptionsTable(), ensureRoleColumn()]);

  const search = req.nextUrl.searchParams.get("search") ?? "";
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const whereClause = search
    ? `WHERE u.name LIKE ? OR u.email LIKE ?`
    : "";
  const searchParam = `%${search}%`;
  const args = search ? [searchParam, searchParam] : [];

  const [countResult, usersResult] = await Promise.all([
    db.execute({
      sql: `SELECT COUNT(*) as count FROM user u ${whereClause}`,
      args,
    }),
    db.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.createdAt,
                   s.status as sub_status, s.lemonsqueezy_subscription_id, s.lemonsqueezy_customer_id
            FROM user u
            LEFT JOIN subscriptions s ON s.user_id = u.id
            ${whereClause}
            ORDER BY u.createdAt DESC
            LIMIT ? OFFSET ?`,
      args: [...args, PAGE_SIZE, offset],
    }),
  ]);

  return NextResponse.json({
    users: usersResult.rows,
    total: Number(countResult.rows[0]?.count ?? 0),
    page,
    pageSize: PAGE_SIZE,
  });
}
