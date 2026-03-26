import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import { getInsertArgValue, getWhereIdArg } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";
import { getCommentOwner } from "../ownership-cache";

/**
 * Validates writes to comments, activity_feed, and entity_history.
 * - INSERT: user_id must match current user
 * - UPDATE: only comment author can update (comments only)
 * - DELETE: only comment author can delete
 * - entity_history and activity_feed are append-only (no UPDATE/DELETE)
 */
export async function validateCommentOrActivity(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<ValidationResult> {
  const table = stmt.table!;

  if (stmt.operation === "INSERT") {
    const userId = getInsertArgValue(stmt, "user_id", args);
    if (userId !== undefined && userId !== ctx.userId) {
      return {
        allowed: false,
        reason: `Cannot create ${table} entry as another user`,
      };
    }
    return ALLOW;
  }

  // entity_history and activity_feed are append-only
  if (table === "entity_history" || table === "activity_feed") {
    if (stmt.operation === "UPDATE" || stmt.operation === "DELETE") {
      // Team owner can clean up activity
      if (ctx.teamRole === "owner") return ALLOW;
      return {
        allowed: false,
        reason: `${table} entries cannot be modified`,
      };
    }
  }

  // comments: only author can update/delete
  if (table === "comments") {
    if (stmt.operation === "UPDATE" || stmt.operation === "DELETE") {
      // Team owner can moderate
      if (ctx.teamRole === "owner") return ALLOW;

      const commentId = getWhereIdArg(args);
      if (!commentId) return ALLOW;

      const owner = await getCommentOwner(
        commentId,
        ctx.tursoUrl,
        ctx.tursoToken,
      );
      if (owner && owner !== ctx.userId) {
        return {
          allowed: false,
          reason: "Cannot modify another user's comment",
        };
      }
    }
  }

  return ALLOW;
}
