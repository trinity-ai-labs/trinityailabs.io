"use client";

import { useState, use, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StorageBar } from "@/components/dashboard/storage-bar";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

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

function BillingSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-44 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "destructive" | "outline" | "secondary";
    dot: string;
  }
> = {
  active: { label: "Active", variant: "default", dot: "bg-emerald-500" },
  comp: { label: "Complimentary", variant: "secondary", dot: "bg-cyan-500" },
  cancelled: { label: "Cancelled", variant: "destructive", dot: "bg-red-500" },
  paused: { label: "Paused", variant: "outline", dot: "bg-amber-500" },
  past_due: { label: "Past Due", variant: "destructive", dot: "bg-red-500" },
  inactive: { label: "Inactive", variant: "outline", dot: "bg-gray-500" },
};

function BillingContent({
  usagePromise,
}: {
  usagePromise: Promise<DashboardUsage>;
}) {
  const usage = use(usagePromise);
  const { subscription, storage, teams } = usage;
  const [loading, setLoading] = useState(false);

  const isActive =
    subscription?.status === "active" || subscription?.status === "comp";

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  async function handleManage() {
    setLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  const config =
    statusConfig[subscription?.status ?? "inactive"] ?? statusConfig.inactive;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and storage usage.
        </p>
      </div>

      {/* Subscription Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={config.variant}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}
                  />
                  {config.label}
                </Badge>
                {subscription.status !== "comp" && (
                  <span className="text-sm text-muted-foreground">
                    Pro — $10/month
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Seats</p>
                  <p className="font-medium">{subscription.seatsPurchased}</p>
                </div>
                {subscription.currentPeriodEnd && (
                  <div>
                    <p className="text-muted-foreground">
                      {subscription.status === "cancelled"
                        ? "Access until"
                        : "Renews"}
                    </p>
                    <p className="font-medium">
                      {new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {subscription.status !== "comp" && subscription.hasCustomer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManage}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Manage Subscription"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Subscribe to Pro for $10/month to unlock cloud sync, unlimited
                projects, managed storage, and full features.
              </p>
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                {loading ? "Loading..." : "Subscribe — $10/mo"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            Managed cloud storage for project assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <StorageBar
            label="Personal"
            usedBytes={storage.usedBytes}
            quotaBytes={storage.quotaBytes}
          />

          {teams.length > 0 && (
            <div className="space-y-4 pt-2 border-t">
              {teams.map((team) => (
                <StorageBar
                  key={team.id}
                  label={team.name}
                  usedBytes={team.storageUsedBytes}
                  quotaBytes={team.storageQuotaBytes}
                />
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            5 GB included per seat. Teams pool storage across seats (e.g. 5
            seats = 25 GB shared).
          </p>
        </CardContent>
      </Card>

      {/* Add-on Storage Placeholder */}
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-4 py-6">
          <Package className="w-8 h-8 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Need more storage?
            </p>
            <p className="text-xs text-muted-foreground/70">
              Additional 10 GB packs for $5/mo — coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BillingPage() {
  const [usagePromise] = useState(() => fetchUsage());

  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingContent usagePromise={usagePromise} />
    </Suspense>
  );
}
