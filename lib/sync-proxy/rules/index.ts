import type { ClassifiedStatement, HranaValue } from "../sql-classifier";
import type { ValidationContext } from "../validate-writes";
import { validateProject } from "./projects";
import { validateChildEntity } from "./child-entities";
import { validateExecutionJob } from "./execution-jobs";
import { validateCommentOrActivity } from "./comments-activity";
import { validateTeamData } from "./team-data";
import { validatePassthrough } from "./passthrough";

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

export type RuleValidator = (
  stmt: ClassifiedStatement,
  args: HranaValue[],
  ctx: ValidationContext,
) => Promise<ValidationResult>;

const ALLOW: ValidationResult = { allowed: true };

// Map table names to their validator
const tableValidators: Record<string, RuleValidator> = {
  // Core ownership
  projects: validateProject,

  // Child entities (linked via project_id or prd_id chain)
  prds: validateChildEntity,
  phases: validateChildEntity,
  epics: validateChildEntity,
  stories: validateChildEntity,
  project_assets: validateChildEntity,

  // Execution
  execution_jobs: validateExecutionJob,

  // User-attributed
  comments: validateCommentOrActivity,
  activity_feed: validateCommentOrActivity,
  entity_history: validateCommentOrActivity,

  // Team-scoped
  team_settings: validateTeamData,
  team_member_profiles: validateTeamData,
  presence: validateTeamData,

  // Passthrough (project-scoped, any team member can write)
  knowledge_books: validatePassthrough,
  knowledge_chapters: validatePassthrough,
  knowledge_pages: validatePassthrough,
  tags: validatePassthrough,
  story_tags: validatePassthrough,
  epic_tags: validatePassthrough,
  phase_tags: validatePassthrough,
  prd_tags: validatePassthrough,
  page_tags: validatePassthrough,
  story_repo_states: validatePassthrough,
  parent_merges: validatePassthrough,
  agent_handoffs: validatePassthrough,
  ai_events: validatePassthrough,
  recaps: validatePassthrough,
  recap_tags: validatePassthrough,
  graph_layouts: validatePassthrough,
  stack_items: validatePassthrough,
  codebase_map: validatePassthrough,
  secrets: validatePassthrough,
  comment_attachments: validatePassthrough,
};

// Tables that are safe to write without validation (migration tracking, etc.)
const UNRESTRICTED_TABLES = new Set(["migrations"]);

export function getValidator(
  tableName: string,
): RuleValidator | "unrestricted" | null {
  if (UNRESTRICTED_TABLES.has(tableName)) return "unrestricted";
  return tableValidators[tableName] ?? null;
}

export { ALLOW };
