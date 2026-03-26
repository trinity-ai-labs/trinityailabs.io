/**
 * Lightweight in-memory cache for project ownership and entity→project mappings.
 * Used by write validation to avoid per-statement DB round-trips.
 */

import { createClient, type Client } from "@libsql/client";
import { TTLCache } from "@/lib/ttl-cache";

// ── Types ───────────────────────────────────────────────────────────

export interface ProjectOwner {
  createdBy: string | null;
  ownerType: string;
  ownerId: string;
}

// ── Cache ───────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60_000; // 60 seconds

/** Tables with a direct project_id column (used for entity→project resolution). */
const DIRECT_PROJECT_TABLES = new Set([
  "project_assets",
  "ai_events",
  "recaps",
  "graph_layouts",
  "stack_items",
  "codebase_map",
  "secrets",
  "knowledge_books",
  "execution_jobs",
  "comments",
  "activity_feed",
  "tags",
]);

/** Tables linked to projects via prd_id. */
const PRD_LINKED_TABLES = new Set(["stories", "phases", "epics"]);

const projectOwnerCache = new TTLCache<string, ProjectOwner>({
  maxSize: 500,
  ttlMs: CACHE_TTL_MS,
  sweepIntervalMs: 60_000,
});
const prdToProjectCache = new TTLCache<string, string>({
  maxSize: 500,
  ttlMs: CACHE_TTL_MS,
  sweepIntervalMs: 60_000,
});
const entityToProjectCache = new TTLCache<string, string>({
  maxSize: 500,
  ttlMs: CACHE_TTL_MS,
  sweepIntervalMs: 60_000,
});

// ── Client pool — one HTTP client per team DB ───────────────────────

const clientPool = new TTLCache<string, Client>({
  maxSize: 50,
  ttlMs: 10 * 60 * 1000,
  sweepIntervalMs: 60_000,
});

function getTeamClient(tursoUrl: string, tursoToken: string): Client {
  const existing = clientPool.get(tursoUrl);
  if (existing) return existing;

  const httpUrl = tursoUrl.replace("libsql://", "https://");
  const client = createClient({ url: httpUrl, authToken: tursoToken });
  clientPool.set(tursoUrl, client);
  return client;
}

// ── Public API ──────────────────────────────────────────────────────

export async function getProjectOwner(
  projectId: string,
  tursoUrl: string,
  tursoToken: string,
): Promise<ProjectOwner | null> {
  const cached = projectOwnerCache.get(projectId);
  if (cached) return cached;

  const client = getTeamClient(tursoUrl, tursoToken);
  const result = await client.execute({
    sql: "SELECT created_by, owner_type, owner_id FROM projects WHERE id = ?",
    args: [projectId],
  });

  if (!result.rows.length) return null;

  const row = result.rows[0];
  const owner: ProjectOwner = {
    createdBy: (row.created_by as string) ?? null,
    ownerType: row.owner_type as string,
    ownerId: row.owner_id as string,
  };
  projectOwnerCache.set(projectId, owner);
  return owner;
}

export async function getProjectForPrd(
  prdId: string,
  tursoUrl: string,
  tursoToken: string,
): Promise<string | null> {
  const cached = prdToProjectCache.get(prdId);
  if (cached) return cached;

  const client = getTeamClient(tursoUrl, tursoToken);
  const result = await client.execute({
    sql: "SELECT project_id FROM prds WHERE id = ?",
    args: [prdId],
  });

  if (!result.rows.length) return null;

  const projectId = result.rows[0].project_id as string;
  prdToProjectCache.set(prdId, projectId);
  return projectId;
}

export async function getProjectForEntity(
  table: string,
  entityId: string,
  tursoUrl: string,
  tursoToken: string,
): Promise<string | null> {
  const cacheKey = `${table}:${entityId}`;
  const cached = entityToProjectCache.get(cacheKey);
  if (cached) return cached;

  const client = getTeamClient(tursoUrl, tursoToken);

  if (DIRECT_PROJECT_TABLES.has(table)) {
    const result = await client.execute({
      sql: `SELECT project_id FROM "${table}" WHERE id = ?`,
      args: [entityId],
    });
    if (!result.rows.length) return null;
    const projectId = result.rows[0].project_id as string;
    entityToProjectCache.set(cacheKey, projectId);
    return projectId;
  }

  if (PRD_LINKED_TABLES.has(table)) {
    const result = await client.execute({
      sql: `SELECT prd_id FROM "${table}" WHERE id = ?`,
      args: [entityId],
    });
    if (!result.rows.length) return null;
    const prdId = result.rows[0].prd_id as string;
    const projectId = await getProjectForPrd(prdId, tursoUrl, tursoToken);
    if (projectId) entityToProjectCache.set(cacheKey, projectId);
    return projectId;
  }

  return null;
}

const lastWarmed = new TTLCache<string, boolean>({
  maxSize: 100,
  ttlMs: CACHE_TTL_MS,
});

/**
 * Preload project ownership for a team. Skips if warmed within the TTL.
 */
export async function warmProjectCache(
  teamId: string,
  tursoUrl: string,
  tursoToken: string,
): Promise<void> {
  if (lastWarmed.get(teamId)) return;

  const client = getTeamClient(tursoUrl, tursoToken);
  const result = await client.execute({
    sql: "SELECT id, created_by, owner_type, owner_id FROM projects WHERE owner_type = 'team' AND owner_id = ?",
    args: [teamId],
  });

  for (const row of result.rows) {
    const owner: ProjectOwner = {
      createdBy: (row.created_by as string) ?? null,
      ownerType: row.owner_type as string,
      ownerId: row.owner_id as string,
    };
    projectOwnerCache.set(row.id as string, owner);
  }
  lastWarmed.set(teamId, true);
}

/**
 * Verify a project belongs to the team in the validation context.
 * Returns ALLOW if the project is not yet in the remote or belongs to the team.
 */
export async function verifyTeamOwnership(
  projectId: string,
  ctx: { teamId: string; tursoUrl: string; tursoToken: string },
  entityLabel?: string,
): Promise<{ allowed: true } | { allowed: false; reason: string }> {
  const owner = await getProjectOwner(projectId, ctx.tursoUrl, ctx.tursoToken);
  if (!owner) return { allowed: true };

  if (owner.ownerType !== "team" || owner.ownerId !== ctx.teamId) {
    const prefix = entityLabel ? `${entityLabel}'s project` : "Project";
    return {
      allowed: false,
      reason: `${prefix} ${projectId} does not belong to this team`,
    };
  }

  return { allowed: true };
}

export async function getCommentOwner(
  commentId: string,
  tursoUrl: string,
  tursoToken: string,
): Promise<string | null> {
  const client = getTeamClient(tursoUrl, tursoToken);
  const result = await client.execute({
    sql: "SELECT user_id FROM comments WHERE id = ?",
    args: [commentId],
  });
  if (!result.rows.length) return null;
  return result.rows[0].user_id as string;
}
