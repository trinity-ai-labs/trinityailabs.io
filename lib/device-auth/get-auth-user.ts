import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { verifyAccessToken } from "./jwt";

/**
 * Resolve the authenticated user ID from either a session cookie (website)
 * or a Bearer token (desktop app proxy). Returns null if unauthenticated.
 */
export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.id) return session.user.id;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = await verifyAccessToken(authHeader.slice(7));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
