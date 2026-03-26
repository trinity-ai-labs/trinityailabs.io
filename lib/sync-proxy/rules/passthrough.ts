import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import type { ValidationResult } from "./index";
import { ALLOW } from "./index";

/**
 * Passthrough validation for project-scoped tables where any team member
 * can read/write (knowledge, tags, recaps, graph layouts, etc.).
 *
 * These tables are inherently scoped to a team DB, so cross-team access
 * is already prevented by the proxy's scope routing. No per-row ownership
 * checks needed — all team members collaborate on shared data.
 */
export async function validatePassthrough(
  _stmt: ClassifiedStatement,
  _args: HranaValue[],
  _ctx: ValidationContext,
): Promise<ValidationResult> {
  return ALLOW;
}
