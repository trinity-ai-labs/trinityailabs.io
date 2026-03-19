"use client";

import { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [subscription, setSubscription] = useState<Subscription>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSubscription(data))
      .catch(() => {})
      .finally(() => setSubLoading(false));
  }, []);

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

  const isActive = subscription?.status === "active";

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
            {subLoading
              ? "Loading..."
              : isActive
                ? "Your subscription is active."
                : "You don't have an active subscription."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? null : isActive ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">Pro plan - Active</span>
              </div>
              {subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground">
                  Renews{" "}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </p>
              )}
              <Button variant="outline" onClick={handleManage}>
                Manage Subscription
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
                Subscribe - $10/mo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
