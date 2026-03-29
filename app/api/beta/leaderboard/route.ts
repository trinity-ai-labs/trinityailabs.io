import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureBugReportsTables } from "@/lib/ensure-tables";

export async function GET() {
  await ensureBugReportsTables();

  const result = await db.execute(`
    SELECT
      user_id,
      user_name,
      user_email,
      COUNT(*) as total_reports,
      SUM(CASE WHEN quality = 'useful' THEN 1 ELSE 0 END) as useful_count,
      SUM(CASE WHEN quality = 'applied' THEN 1 ELSE 0 END) as applied_count
    FROM bug_reports
    GROUP BY user_id
    ORDER BY
      SUM(CASE WHEN quality = 'applied' THEN 1 ELSE 0 END) DESC,
      SUM(CASE WHEN quality = 'useful' THEN 1 ELSE 0 END) DESC,
      COUNT(*) DESC
    LIMIT 50
  `);

  return NextResponse.json({ leaders: result.rows });
}
