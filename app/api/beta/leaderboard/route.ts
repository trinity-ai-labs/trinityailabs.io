import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ensureBugReportsTables,
  ensureUserPreferencesTable,
} from "@/lib/ensure-tables";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export async function GET() {
  await Promise.all([ensureBugReportsTables(), ensureUserPreferencesTable()]);

  const result = await db.execute(`
    SELECT
      br.user_id,
      br.user_name,
      br.user_email,
      COUNT(*) as total_reports,
      SUM(CASE WHEN br.quality = 'useful' THEN 1 ELSE 0 END) as useful_count,
      SUM(CASE WHEN br.quality = 'applied' THEN 1 ELSE 0 END) as applied_count,
      up.value as show_email
    FROM bug_reports br
    LEFT JOIN user_preferences up
      ON up.user_id = br.user_id AND up.key = 'show_email_on_leaderboard'
    GROUP BY br.user_id
    ORDER BY
      SUM(CASE WHEN br.quality = 'applied' THEN 1 ELSE 0 END) DESC,
      SUM(CASE WHEN br.quality = 'useful' THEN 1 ELSE 0 END) DESC,
      COUNT(*) DESC
    LIMIT 50
  `);

  const leaders = result.rows.map((row) => ({
    user_id: row.user_id,
    user_name: row.user_name,
    user_email:
      row.show_email === "true"
        ? row.user_email
        : maskEmail(row.user_email as string),
    total_reports: row.total_reports,
    useful_count: row.useful_count,
    applied_count: row.applied_count,
  }));

  return NextResponse.json({ leaders });
}
