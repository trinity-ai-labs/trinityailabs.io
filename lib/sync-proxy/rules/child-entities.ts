import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import { getInsertArgValue, getWhereIdArg } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";
import {
  verifyTeamOwnership,
  getProjectForPrd,
  getProjectForEntity,
} from "../ownership-cache";

/**
 * Validates writes to child entities (PRDs, stories, epics, phases, project_assets).
 * Verifies the parent project belongs to the current team.
 */
export async function validateChildEntity(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<ValidationResult> {
  const table = stmt.table!;

  if (stmt.operation === "INSERT") {
    const projectId = await resolveProjectFromInsert(stmt, args, ctx);
    if (!projectId) return ALLOW;
    return verifyTeamOwnership(projectId, ctx);
  }

  if (stmt.operation === "UPDATE" || stmt.operation === "DELETE") {
    const entityId = getWhereIdArg(args);
    if (!entityId) return ALLOW;

    const projectId = await getProjectForEntity(
      table,
      entityId,
      ctx.tursoUrl,
      ctx.tursoToken,
    );
    if (!projectId) return ALLOW;
    return verifyTeamOwnership(projectId, ctx);
  }

  return ALLOW;
}

async function resolveProjectFromInsert(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<string | null> {
  const directProjectId = getInsertArgValue(stmt, "project_id", args);
  if (directProjectId) return directProjectId;

  const prdId = getInsertArgValue(stmt, "prd_id", args);
  if (prdId) {
    return getProjectForPrd(prdId, ctx.tursoUrl, ctx.tursoToken);
  }

  return null;
}
