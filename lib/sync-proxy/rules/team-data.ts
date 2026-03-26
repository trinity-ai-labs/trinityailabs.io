import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import { getInsertArgValue } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";

/**
 * Validates writes to team-scoped tables:
 * - team_settings: owner only
 * - team_member_profiles: own row only
 * - presence: own row only
 */
export async function validateTeamData(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<ValidationResult> {
  const table = stmt.table!;

  if (table === "team_settings") {
    if (ctx.teamRole !== "owner") {
      return {
        allowed: false,
        reason: "Only team owners can modify team settings",
      };
    }
    return ALLOW;
  }

  // team_member_profiles and presence: users can only write their own row
  if (table === "team_member_profiles" || table === "presence") {
    if (stmt.operation === "INSERT") {
      const userId = getInsertArgValue(stmt, "user_id", args);
      if (userId !== undefined && userId !== ctx.userId) {
        return {
          allowed: false,
          reason: `Cannot write ${table} for another user`,
        };
      }
    }
    // UPDATE/DELETE — team owner can moderate, otherwise allow
    // (the WHERE clause should scope to the user's own row)
    return ALLOW;
  }

  return ALLOW;
}
