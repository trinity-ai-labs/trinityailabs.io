import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "60 s"),
      prefix: "rl:auth",
    })
  : null;

const billingLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "rl:billing",
    })
  : null;

const syncLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(200, "60 s"),
      prefix: "rl:turso-sync",
    })
  : null;

export async function proxy(request: NextRequest) {
  if (!redis) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const limiter = pathname.startsWith("/api/turso-sync")
    ? syncLimiter
    : pathname.startsWith("/api/auth")
      ? authLimiter
      : billingLimiter;

  if (!limiter) return NextResponse.next();

  const { success, remaining } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/billing/:path*",
    "/api/turso-sync/:path*",
  ],
};
