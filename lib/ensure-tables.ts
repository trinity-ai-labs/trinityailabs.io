import { db } from "@/lib/db";

let roleColumnEnsured = false;

export async function ensureRoleColumn() {
  if (roleColumnEnsured) return;
  try {
    await db.execute(
      `ALTER TABLE user ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`
    );
  } catch {
    // Column already exists
  }
  roleColumnEnsured = true;
}

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
