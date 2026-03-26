import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import { getInsertArgValue, getWhereIdArg } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";
import { getProjectOwner } from "../ownership-cache";

export async function validateProject(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<ValidationResult> {
  if (stmt.operation === "INSERT") {
    // Enforce created_by = current user
    const createdBy = getInsertArgValue(stmt, "created_by", args);
    if (createdBy !== undefined && createdBy !== ctx.userId) {
      return {
        allowed: false,
        reason: `Cannot create a project as another user (created_by=${createdBy})`,
      };
    }

    // Enforce owner_id matches team
    const ownerType = getInsertArgValue(stmt, "owner_type", args);
    const ownerId = getInsertArgValue(stmt, "owner_id", args);
    if (ownerType === "team" && ownerId !== ctx.teamId) {
      return {
        allowed: false,
        reason: `Cannot create a project in another team (owner_id=${ownerId})`,
      };
    }

    return ALLOW;
  }

  if (stmt.operation === "UPDATE" || stmt.operation === "DELETE") {
    const projectId = getWhereIdArg(args);
    if (!projectId) {
      return { allowed: false, reason: "Cannot determine project ID" };
    }

    const owner = await getProjectOwner(
      projectId,
      ctx.tursoUrl,
      ctx.tursoToken,
    );
    if (!owner) return ALLOW; // New project not yet in remote — allow

    // Team owner can do anything
    if (ctx.teamRole === "owner") return ALLOW;

    // Members can only modify projects they created
    if (owner.createdBy !== ctx.userId) {
      return {
        allowed: false,
        reason: `You did not create project ${projectId}`,
      };
    }

    return ALLOW;
  }

  return ALLOW;
}
