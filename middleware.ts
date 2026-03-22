import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hits = new Map<string, { count: number; resetTime: number }>();

function checkRate(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetTime) {
    hits.set(key, { count: 1, resetTime: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - entry.count };
}

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/auth": { limit: 20, windowMs: 60_000 },
  "/api/billing": { limit: 10, windowMs: 60_000 },
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) {
      const key = `${ip}:${prefix}`;
      const { ok, remaining } = checkRate(key, config.limit, config.windowMs);

      if (!ok) {
        return NextResponse.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: { "Retry-After": "60" },
          },
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/api/billing/:path*"],
};
