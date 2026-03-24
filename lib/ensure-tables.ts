import { db } from "@/lib/db";

let roleColumnEnsured = false;

export async function ensureRoleColumn() {
  if (roleColumnEnsured) return;
  try {
    await db.execute(
      `ALTER TABLE user ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`,
    );
  } catch {
    // Column already exists
  }
  roleColumnEnsured = true;
}

let userColumnsEnsured = false;

export async function ensureUserColumns() {
  if (userColumnsEnsured) return;
  const columns = [
    "handle TEXT UNIQUE",
    "turso_db_name TEXT",
    "turso_db_url TEXT",
    "turso_auth_token TEXT",
  ];
  for (const col of columns) {
    try {
      await db.execute(`ALTER TABLE user ADD COLUMN ${col}`);
    } catch {
      // Column already exists
    }
  }
  userColumnsEnsured = true;
}

export async function ensureTeamsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      avatar_url TEXT,
      turso_db_name TEXT,
      turso_db_url TEXT,
      encryption_key TEXT,
      owner_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export async function ensureTeamMembersTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS team_members (
      team_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
      turso_token TEXT,
      joined_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (team_id, user_id)
    )
  `);
}

export async function ensureTeamInvitesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS team_invites (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      email TEXT NOT NULL,
      invited_by TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    )
  `);
}

export async function ensureUserPreferencesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, key)
    )
  `);
}

async function ensureTeamsTables() {
  await ensureTeamsTable();
  await ensureTeamMembersTable();
  await ensureTeamInvitesTable();
}

export { ensureTeamsTables };

let subscriptionsEnsured = false;

export async function ensureSubscriptionsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lemonsqueezy_subscription_id TEXT,
      lemonsqueezy_customer_id TEXT,
      status TEXT NOT NULL DEFAULT 'inactive',
      current_period_end TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  if (!subscriptionsEnsured) {
    for (const col of ["team_id TEXT", "seats_purchased INTEGER DEFAULT 1"]) {
      try {
        await db.execute(`ALTER TABLE subscriptions ADD COLUMN ${col}`);
      } catch {
        // Column already exists
      }
    }
    subscriptionsEnsured = true;
  }
}

export async function ensureInvitesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS invites (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      free_access INTEGER NOT NULL DEFAULT 0,
      invited_by TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export async function ensureDeviceCodesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS device_codes (
      code TEXT PRIMARY KEY,
      user_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )
  `);
}

export async function ensureRefreshTokensTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

let sponsoredSeatsEnsured = false;

export async function ensureSponsoredSeatsTable() {
  if (sponsoredSeatsEnsured) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sponsored_seats (
      id TEXT PRIMARY KEY,
      sponsor_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now')),
      cancelled_at TEXT,
      UNIQUE(sponsor_id, user_id)
    )
  `);
  sponsoredSeatsEnsured = true;
}

export async function ensureStorageUsageTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS storage_usage (
      scope TEXT NOT NULL,
      scope_id TEXT NOT NULL,
      used_bytes INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (scope, scope_id)
    )
  `);
}
