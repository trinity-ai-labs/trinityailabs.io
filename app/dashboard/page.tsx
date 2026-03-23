"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StorageBar, formatBytes } from "@/components/dashboard/storage-bar";
import { Users, ArrowRight } from "lucide-react";

type DashboardUsage = {
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    seatsPurchased: number;
    hasCustomer: boolean;
  } | null;
  storage: {
    usedBytes: number;
    quotaBytes: number;
  };
  teams: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    memberCount: number;
    storageUsedBytes: number;
    storageQuotaBytes: number;
  }>;
};

function fetchUsage(): Promise<DashboardUsage> {
  return fetch("/api/dashboard/usage")
    .then((res) =>
      res.ok
        ? res.json()
        : {
            subscription: null,
            storage: { usedBytes: 0, quotaBytes: 0 },
            teams: [],
          },
    )
    .catch(
      () =>
        ({
          subscription: null,
          storage: { usedBytes: 0, quotaBytes: 0 },
          teams: [],
        }) as DashboardUsage,
    );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-52 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-28 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-20 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardContent({
  usagePromise,
}: {
  usagePromise: Promise<DashboardUsage>;
}) {
  const { data: session } = authClient.useSession();
  const usage = use(usagePromise);
  const router = useRouter();
  const { subscription, storage, teams } = usage;

  // Redirect to handle setup if user has no handle
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/handle/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.handle) router.replace("/setup-handle");
      })
      .catch(() => {});
  }, [session?.user, router]);

  async function handleSubscribe() {
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  async function handleManage() {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  const isActive =
    subscription?.status === "active" || subscription?.status === "comp";
  const isCancelled = subscription?.status === "cancelled";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {session?.user.name ?? "there"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your Trinity account and subscription.
        </p>
      </div>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            {isActive
              ? "Your subscription is active."
              : isCancelled
                ? "Your subscription has been cancelled."
                : "You don't have an active subscription."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {subscription?.status === "comp"
                    ? "Complimentary access"
                    : "Pro — $10/month"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{subscription?.seatsPurchased ?? 1} seat</span>
                {subscription?.currentPeriodEnd && (
                  <span>
                    Renews{" "}
                    {new Date(
                      subscription.currentPeriodEnd,
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
              {subscription?.status !== "comp" && (
                <Button variant="outline" size="sm" onClick={handleManage}>
                  Manage Subscription
                </Button>
              )}
            </div>
          ) : isCancelled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm">Pro plan — Cancelled</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your subscription has been cancelled. You can resubscribe at any
                time.
              </p>
              <Button variant="outline" size="sm" onClick={handleManage}>
                Resubscribe
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Subscribe to Pro for $10/month to unlock cloud sync, unlimited
                projects, and full features.
              </p>
              <Button
                onClick={handleSubscribe}
                className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                Subscribe — $10/mo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <CardDescription>
            Managed cloud storage for project assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <StorageBar
            usedBytes={storage.usedBytes}
            quotaBytes={storage.quotaBytes}
          />
          <p className="text-xs text-muted-foreground">
            5 GB included per seat. Need more?{" "}
            <Link
              href="/dashboard/billing"
              className="text-emerald-500 hover:underline"
            >
              View billing
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Teams Card */}
      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm font-medium text-emerald-500">
                    {team.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.memberCount} member
                      {team.memberCount !== 1 ? "s" : ""} ·{" "}
                      {formatBytes(team.storageUsedBytes)} /{" "}
                      {formatBytes(team.storageQuotaBytes)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {team.role}
                </span>
              </div>
            ))}
            <Link
              href="/dashboard/teams"
              className="flex items-center gap-1 text-sm text-emerald-500 hover:underline pt-1"
            >
              Manage Teams
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [usagePromise] = useState(() => fetchUsage());

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent usagePromise={usagePromise} />
    </Suspense>
  );
}
