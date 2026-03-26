/**
 * Regex-based SQL classifier for Hrana pipeline requests.
 * Extracts operation type, table name, and arg-to-column mapping.
 * Only needs to handle machine-generated SQL from Trinity's DB module.
 */

export type SqlOperation =
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "SELECT"
  | "DDL"
  | "PRAGMA"
  | "UNKNOWN";

export interface ClassifiedStatement {
  operation: SqlOperation;
  table: string | null;
  /** For INSERTs: ordered list of column names matching positional args */
  columns: string[];
  /** Raw SQL string */
  sql: string;
}

const RE_INSERT =
  /^\s*INSERT\s+(?:OR\s+\w+\s+)?INTO\s+"?(\w+)"?\s*\(([^)]+)\)/i;
const RE_UPDATE = /^\s*UPDATE\s+"?(\w+)"?\s+SET\s/i;
const RE_DELETE = /^\s*DELETE\s+FROM\s+"?(\w+)"?/i;
const RE_SELECT = /^\s*SELECT\s/i;
const RE_DDL =
  /^\s*(CREATE\s+(TABLE|INDEX|UNIQUE\s+INDEX)|ALTER\s+TABLE|DROP\s+(TABLE|INDEX))/i;
const RE_PRAGMA = /^\s*PRAGMA\s/i;

export function classifySql(sql: string): ClassifiedStatement {
  // DDL — migrations
  if (RE_DDL.test(sql)) {
    return { operation: "DDL", table: null, columns: [], sql };
  }

  // PRAGMA
  if (RE_PRAGMA.test(sql)) {
    return { operation: "PRAGMA", table: null, columns: [], sql };
  }

  // SELECT — always read-only
  if (RE_SELECT.test(sql)) {
    return { operation: "SELECT", table: null, columns: [], sql };
  }

  // INSERT
  const insertMatch = sql.match(RE_INSERT);
  if (insertMatch) {
    const table = insertMatch[1].toLowerCase();
    const columns = insertMatch[2]
      .split(",")
      .map((c) => c.trim().replace(/"/g, "").toLowerCase());
    return { operation: "INSERT", table, columns, sql };
  }

  // UPDATE
  const updateMatch = sql.match(RE_UPDATE);
  if (updateMatch) {
    const table = updateMatch[1].toLowerCase();
    return { operation: "UPDATE", table, columns: [], sql };
  }

  // DELETE
  const deleteMatch = sql.match(RE_DELETE);
  if (deleteMatch) {
    const table = deleteMatch[1].toLowerCase();
    return { operation: "DELETE", table, columns: [], sql };
  }

  return { operation: "UNKNOWN", table: null, columns: [], sql };
}

/**
 * Extract the value of a specific column from an INSERT statement's args.
 * Returns undefined if the column is not in the statement.
 */
export function getInsertArgValue(
  stmt: ClassifiedStatement,
  columnName: string,
  args: HranaValue[],
): string | null | undefined {
  const idx = stmt.columns.indexOf(columnName.toLowerCase());
  if (idx === -1 || idx >= args.length) return undefined;
  return extractValue(args[idx]);
}

/**
 * Extract the last arg from a WHERE clause (common pattern: WHERE id = ?).
 * For UPDATE/DELETE, the entity ID is typically the last positional arg.
 */
export function getWhereIdArg(args: HranaValue[]): string | null {
  if (args.length === 0) return null;
  return extractValue(args[args.length - 1]);
}

// ── Hrana value helpers ─────────────────────────────────────────────

export interface HranaValue {
  type: "null" | "integer" | "float" | "text" | "blob";
  value?: string | number | null;
  base64?: string;
}

function extractValue(v: HranaValue): string | null {
  if (v.type === "null" || v.value == null) return null;
  return String(v.value);
}
