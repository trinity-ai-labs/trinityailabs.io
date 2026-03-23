import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureUserColumns } from "@/lib/ensure-tables";

const HANDLE_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

function validateHandle(handle: string): string | null {
  if (!handle || handle.length < 3)
    return "Handle must be at least 3 characters";
  if (handle.length > 30) return "Handle must be 30 characters or fewer";
  if (!HANDLE_REGEX.test(handle))
    return "Handle must be lowercase letters, numbers, and hyphens only (cannot start or end with a hyphen)";
  if (handle.includes("--")) return "Handle cannot contain consecutive hyphens";
  return null;
}

// GET /api/handle?handle=foo — check availability
export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle")?.toLowerCase().trim();
  if (!handle)
    return NextResponse.json({ error: "Handle required" }, { status: 400 });

  const validationError = validateHandle(handle);
  if (validationError)
    return NextResponse.json({ error: validationError }, { status: 400 });

  await ensureUserColumns();

  const result = await db.execute({
    sql: "SELECT id FROM user WHERE handle = ?",
    args: [handle],
  });

  return NextResponse.json({ available: result.rows.length === 0 });
}

// POST /api/handle — set or update handle for authenticated user
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const handle = (body.handle as string)?.toLowerCase().trim();

  const validationError = validateHandle(handle);
  if (validationError)
    return NextResponse.json({ error: validationError }, { status: 400 });

  await ensureUserColumns();

  // Check if taken by someone else
  const existing = await db.execute({
    sql: "SELECT id FROM user WHERE handle = ? AND id != ?",
    args: [handle, session.user.id],
  });
  if (existing.rows.length > 0)
    return NextResponse.json({ error: "Handle already taken" }, { status: 409 });

  await db.execute({
    sql: "UPDATE user SET handle = ? WHERE id = ?",
    args: [handle, session.user.id],
  });

  return NextResponse.json({ handle });
}
