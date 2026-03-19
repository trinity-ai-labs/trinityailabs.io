import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureRoleColumn } from "@/lib/ensure-tables";

export async function getAdminSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;

  await ensureRoleColumn();

  const result = await db.execute({
    sql: `SELECT role FROM user WHERE id = ?`,
    args: [session.user.id],
  });

  const role = result.rows[0]?.role as string | undefined;
  if (role !== "admin") return null;

  return session;
}
