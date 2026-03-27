import { db } from "@/lib/db";
import { ensureTeamsTables } from "@/lib/ensure-tables";
import { createDatabaseToken } from "@/lib/turso-admin";
import { TTLCache } from "@/lib/ttl-cache";

// ── Credential Cache ────────────────────────────────────────────────

interface CachedCredentials {
  tursoUrl: string;
  tursoToken: string;
  tursoDbName: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const credentialCache = new TTLCache<string, CachedCredentials>({
  maxSize: 200,
  ttlMs: CACHE_TTL_MS,
  sweepIntervalMs: 60_000,
});

export function invalidateCache(key: string): void {
  credentialCache.delete(key);
}

// ── Credential Resolution ───────────────────────────────────────────

export interface TursoCredentials {
  tursoUrl: string;
  tursoToken: string;
  tursoDbName: string;
}

export async function resolveTeamCredentials(
  userId: string,
  teamId: string,
): Promise<TursoCredentials | null> {
  const cacheKey = `team:${userId}:${teamId}`;
  const cached = credentialCache.get(cacheKey);
  if (cached) return cached;

  await ensureTeamsTables();

  const result = await db.execute({
    sql: `SELECT t.turso_db_url, t.turso_db_name, tm.turso_token
          FROM teams t
          JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = ?
          WHERE t.id = ?`,
    args: [userId, teamId],
  });

  if (!result.rows.length) return null;

  const row = result.rows[0];
  const tursoUrl = row.turso_db_url as string | null;
  const tursoToken = row.turso_token as string | null;
  const tursoDbName = row.turso_db_name as string | null;

  if (!tursoUrl || !tursoToken || !tursoDbName) return null;

  const creds: CachedCredentials = { tursoUrl, tursoToken, tursoDbName };
  credentialCache.set(cacheKey, creds);
  return creds;
}

// ── Token Rotation ──────────────────────────────────────────────────

async function rotateTeamToken(
  userId: string,
  teamId: string,
  dbName: string,
): Promise<string | null> {
  try {
    const newToken = await createDatabaseToken(dbName);
    await db.execute({
      sql: "UPDATE team_members SET turso_token = ? WHERE team_id = ? AND user_id = ?",
      args: [newToken, teamId, userId],
    });
    invalidateCache(`team:${userId}:${teamId}`);
    return newToken;
  } catch (err) {
    console.error("[turso-proxy] Team token rotation failed:", err);
    return null;
  }
}

export interface TeamProxyScope {
  userId: string;
  teamId: string;
}

/**
 * Proxy a request to Turso with automatic token rotation on 401.
 * If Turso rejects the token, generate a fresh one and retry once.
 */
export async function proxyWithRotation(
  req: Request,
  creds: TursoCredentials,
  subPath: string,
  scope: TeamProxyScope,
): Promise<Response> {
  const firstAttempt = await proxyToTurso(
    req,
    creds.tursoUrl,
    creds.tursoToken,
    subPath,
  );

  if (firstAttempt.status !== 401) return firstAttempt;

  // Token expired — rotate and retry
  const newToken = await rotateTeamToken(
    scope.userId,
    scope.teamId,
    creds.tursoDbName,
  );

  if (!newToken) return firstAttempt;

  const retryReq = req.clone();
  return proxyToTurso(retryReq, creds.tursoUrl, newToken, subPath);
}

// ── Proxy Forwarding ────────────────────────────────────────────────

/** Headers safe to forward from Turso back to the client. */
const PASSTHROUGH_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
  "content-encoding",
  "transfer-encoding",
]);

export async function proxyToTurso(
  req: Request,
  tursoUrl: string,
  tursoToken: string,
  subPath: string,
): Promise<Response> {
  // libsql:// → https://
  const tursoHttpUrl = tursoUrl.replace("libsql://", "https://");
  const upstreamUrl = subPath ? `${tursoHttpUrl}/${subPath}` : tursoHttpUrl;

  const upstreamHeaders = new Headers();
  // Forward content-type from the original request
  const ct = req.headers.get("content-type");
  if (ct) upstreamHeaders.set("content-type", ct);
  // Set the real Turso auth token
  upstreamHeaders.set("authorization", `Bearer ${tursoToken}`);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const fetchInit: RequestInit & Record<string, unknown> = {
    method: req.method,
    headers: upstreamHeaders,
    body: hasBody ? req.body : undefined,
  };
  if (hasBody) fetchInit.duplex = "half";

  const upstreamRes = await fetch(upstreamUrl, fetchInit);

  // Build filtered response headers
  const responseHeaders = new Headers();
  for (const [key, value] of upstreamRes.headers) {
    if (PASSTHROUGH_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: responseHeaders,
  });
}
