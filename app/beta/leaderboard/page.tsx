"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Bug, CheckCircle2, Zap } from "lucide-react";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

interface LeaderEntry {
  user_id: string;
  user_name: string | null;
  user_email: string;
  total_reports: number;
  useful_count: number;
  applied_count: number;
}

function fetchLeaderboard(): Promise<LeaderEntry[]> {
  return fetch("/api/beta/leaderboard")
    .then((r) => r.json())
    .then((data) => data.leaders ?? []);
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50"
        >
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
        </div>
      ))}
    </div>
  );
}

function LeaderboardList({
  promise,
}: {
  promise: Promise<LeaderEntry[]>;
}) {
  const leaders = use(promise);

  if (leaders.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Bug className="w-10 h-10 mx-auto mb-4 opacity-50" />
        <p>No bug reports yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leaders.map((entry, i) => {
        const rank = i + 1;
        const displayName = entry.user_name || entry.user_email;

        return (
          <div
            key={entry.user_id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
              rank <= 3
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border bg-card/50"
            }`}
          >
            {/* Rank */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                rank === 1
                  ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black"
                  : rank === 2
                    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black"
                    : rank === 3
                      ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {rank}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{displayName}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bug className="w-3 h-3" />
                  {entry.total_reports} reported
                </span>
                {Number(entry.useful_count) > 0 && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {entry.useful_count} useful
                  </span>
                )}
                {Number(entry.applied_count) > 0 && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {entry.applied_count} applied
                  </span>
                )}
              </div>
            </div>

            {/* Score badge */}
            {(Number(entry.useful_count) > 0 ||
              Number(entry.applied_count) > 0) && (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              >
                {Number(entry.applied_count) * 3 +
                  Number(entry.useful_count) * 1}{" "}
                pts
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardPage() {
  const [promise, setPromise] = useState<Promise<LeaderEntry[]> | null>(null);

  useEffect(() => {
    const p = fetchLeaderboard();
    Promise.resolve().then(() => setPromise(p));
  }, []);

  return (
    <main className="min-h-screen">
      <Nav />

      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/beta">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Beta Program
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-card/50 backdrop-blur">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-mono text-muted-foreground">
                Bug Hunter Leaderboard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Top bug hunters
            </h1>
            <p className="text-muted-foreground">
              The testers making Trinity better, one bug at a time.
            </p>
          </div>

          {promise ? (
            <Suspense fallback={<LeaderboardSkeleton />}>
              <LeaderboardList promise={promise} />
            </Suspense>
          ) : (
            <LeaderboardSkeleton />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
