import { verifyAccessToken } from "./jwt";

export class AccessTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessTokenError";
  }
}

/**
 * Extract and verify a Bearer token from the request.
 * Throws AccessTokenError if the token is missing or invalid.
 */
export async function requireAccessToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AccessTokenError("Missing access token");
  }
  try {
    return await verifyAccessToken(authHeader.slice(7));
  } catch {
    throw new AccessTokenError("Invalid or expired token");
  }
}
