import type { RuleValidator } from "./index";
import { ALLOW } from "./index";

/**
 * Passthrough validation for project-scoped tables where any team member
 * can read/write (knowledge, tags, recaps, graph layouts, etc.).
 *
 * These tables are inherently scoped to a team DB, so cross-team access
 * is already prevented by the proxy's scope routing. No per-row ownership
 * checks needed — all team members collaborate on shared data.
 */
export const validatePassthrough: RuleValidator = async () => ALLOW;
