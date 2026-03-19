"use client";

import { useState, use, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Subscription = {
  status: string;
  current_period_end: string | null;
} | null;

function fetchSubscription(): Promise<Subscription> {
  return fetch("/api/billing/status")
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
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
    </div>
  );
}

function DashboardContent({
  subPromise,
}: {
  subPromise: Promise<Subscription>;
}) {
  const { data: session } = authClient.useSession();
  const subscription = use(subPromise);

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

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            {isActive
              ? "Your subscription is active."
              : "You don't have an active subscription."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">
                  {subscription?.status === "comp"
                    ? "Complimentary access"
                    : "Pro plan - Active"}
                </span>
              </div>
              {subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground">
                  Renews{" "}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </p>
              )}
              {subscription?.status !== "comp" && (
                <Button variant="outline" onClick={handleManage}>
                  Manage Subscription
                </Button>
              )}
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
                Subscribe - $10/mo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const [subPromise] = useState(() => fetchSubscription());

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent subPromise={subPromise} />
    </Suspense>
  );
}
