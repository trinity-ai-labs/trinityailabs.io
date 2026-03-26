import { classifySql } from "./sql-classifier";
import type { HranaValue } from "./sql-classifier";
import { getValidator, ALLOW } from "./rules";
import type { ValidationResult } from "./rules";

// ── Types ───────────────────────────────────────────────────────────

export interface ValidationContext {
  userId: string;
  teamId: string;
  teamRole: "owner" | "member";
  tursoUrl: string;
  tursoToken: string;
}

interface HranaStmt {
  sql?: string;
  sql_id?: number;
  args?: HranaValue[];
  named_args?: { name: string; value: HranaValue }[];
  want_rows?: boolean;
}

interface HranaBatchStep {
  stmt: HranaStmt;
  condition?: unknown;
}

interface HranaPipelineRequest {
  type: string;
  stmt?: HranaStmt;
  batch?: { steps: HranaBatchStep[] };
  sql?: string;
}

export interface HranaPipelineBody {
  baton?: string;
  requests: HranaPipelineRequest[];
}

// ── Validation ──────────────────────────────────────────────────────

/**
 * Validate all write statements in a Hrana pipeline request body.
 * Returns the first rejection found, or { allowed: true } if all pass.
 */
export async function validatePipelineWrites(
  body: HranaPipelineBody,
  ctx: ValidationContext,
): Promise<ValidationResult> {
  for (const req of body.requests) {
    if (req.type === "execute" && req.stmt) {
      const result = await validateStatement(req.stmt, ctx);
      if (!result.allowed) return result;
    }

    if (req.type === "batch" && req.batch?.steps) {
      for (const step of req.batch.steps) {
        const result = await validateStatement(step.stmt, ctx);
        if (!result.allowed) return result;
      }
    }

    // 'sequence' type contains raw SQL text
    if (req.type === "sequence" && req.sql) {
      const result = await validateRawSql(req.sql, ctx);
      if (!result.allowed) return result;
    }
  }

  return ALLOW;
}

async function validateStatement(
  stmt: HranaStmt,
  ctx: ValidationContext,
): Promise<ValidationResult> {
  if (!stmt.sql) {
    // sql_id references are not supported yet — reject to be safe
    if (stmt.sql_id !== undefined) {
      return {
        allowed: false,
        reason:
          "Stored SQL references (sql_id) are not supported through the proxy",
      };
    }
    return ALLOW;
  }

  const classified = classifySql(stmt.sql);
  const args = stmt.args ?? [];

  // Read-only operations always pass
  if (
    classified.operation === "SELECT" ||
    classified.operation === "DDL" ||
    classified.operation === "PRAGMA"
  ) {
    return ALLOW;
  }

  // Unknown operations are rejected (default-deny)
  if (classified.operation === "UNKNOWN") {
    return {
      allowed: false,
      reason: `Unrecognized SQL operation: ${stmt.sql.slice(0, 80)}`,
    };
  }

  // Look up validator for this table
  if (!classified.table) return ALLOW;

  const validator = getValidator(classified.table);

  // Unrestricted tables (e.g., migrations)
  if (validator === "unrestricted") return ALLOW;

  // Unknown table — default-deny
  if (!validator) {
    return {
      allowed: false,
      reason: `Write to unknown table "${classified.table}" is not allowed`,
    };
  }

  return validator(classified, args, ctx);
}

async function validateRawSql(
  sql: string,
  ctx: ValidationContext,
): Promise<ValidationResult> {
  // Sequence SQL may contain multiple statements separated by semicolons.
  // Split and validate each one.
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const s of statements) {
    const classified = classifySql(s);

    if (
      classified.operation === "SELECT" ||
      classified.operation === "DDL" ||
      classified.operation === "PRAGMA"
    ) {
      continue;
    }

    if (classified.operation === "UNKNOWN") {
      return {
        allowed: false,
        reason: `Unrecognized SQL in sequence: ${s.slice(0, 80)}`,
      };
    }

    if (!classified.table) continue;

    const validator = getValidator(classified.table);
    if (validator === "unrestricted") continue;
    if (!validator) {
      return {
        allowed: false,
        reason: `Write to unknown table "${classified.table}" in sequence`,
      };
    }

    // Sequence statements don't have positional args — validate with empty args
    const result = await validator(classified, [], ctx);
    if (!result.allowed) return result;
  }

  return ALLOW;
}
