import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import { getInsertArgValue, getWhereIdArg } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";
import { verifyTeamOwnership, getProjectForEntity } from "../ownership-cache";

export async function validateExecutionJob(
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
): Promise<ValidationResult> {
  if (stmt.operation === "INSERT") {
    const projectId = getInsertArgValue(stmt, "project_id", args);
    if (!projectId) return ALLOW;
    return verifyTeamOwnership(projectId, ctx, "Execution job");
  }

  if (stmt.operation === "UPDATE" || stmt.operation === "DELETE") {
    const jobId = getWhereIdArg(args);
    if (!jobId) return ALLOW;

    const projectId = await getProjectForEntity(
      "execution_jobs",
      jobId,
      ctx.tursoUrl,
      ctx.tursoToken,
    );
    if (!projectId) return ALLOW;
    return verifyTeamOwnership(projectId, ctx, "Execution job");
  }

  return ALLOW;
}
