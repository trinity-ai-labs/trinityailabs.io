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
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Gift,
  HardDrive,
  Loader2,
  Package,
  Plus,
  UserPlus,
  X,
} from "lucide-react";

type DashboardUsage = {
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    seatsPurchased: number;
    hasCustomer: boolean;
  } | null;
  sponsoredBy: {
    seatId: string;
    sponsorName: string;
    currentPeriodEnd: string | null;
    effectiveUntil: string | null;
  } | null;
  storage: {
    usedBytes: number;
    quotaBytes: number;
    addonBytes: number;
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

type SponsoredSeat = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string;
  userHandle: string | null;
  status: string;
  createdAt: string;
};

type StorageAddon = {
  id: string;
  type: "self" | "gifted" | "received";
  status: string;
  currentPeriodEnd: string | null;
  createdAt: string;
  purchaserName: string | null;
  purchaserEmail: string | null;
  beneficiaryName: string | null;
  beneficiaryEmail: string | null;
};

function fetchSeats(): Promise<SponsoredSeat[]> {
  return fetch("/api/sponsorship")
    .then((res) => (res.ok ? res.json() : { seats: [] }))
    .then((data) => data.seats ?? [])
    .catch(() => []);
}

function fetchUsage(): Promise<DashboardUsage> {
  return fetch("/api/dashboard/usage")
    .then((res) =>
      res.ok
        ? res.json()
        : {
            subscription: null,
            sponsoredBy: null,
            storage: { usedBytes: 0, quotaBytes: 0, addonBytes: 0 },
            teams: [],
          },
    )
    .catch(
      () =>
        ({
          subscription: null,
          sponsoredBy: null,
          storage: { usedBytes: 0, quotaBytes: 0, addonBytes: 0 },
          teams: [],
        }) as DashboardUsage,
    );
}

function fetchAddons(): Promise<StorageAddon[]> {
  return fetch("/api/billing/storage-addon")
    .then((res) => (res.ok ? res.json() : { addons: [] }))
    .then((data) => data.addons ?? [])
    .catch(() => []);
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 GB";
  const gb = bytes / (1024 * 1024 * 1024);
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BillingContent({
  usagePromise,
  seatsPromise,
  addonsPromise,
}: {
  usagePromise: Promise<DashboardUsage>;
  seatsPromise: Promise<SponsoredSeat[]>;
  addonsPromise: Promise<StorageAddon[]>;
}) {
  const usage = use(usagePromise);
  const initialSeats = use(seatsPromise);
  const initialAddons = use(addonsPromise);
  const { subscription, sponsoredBy, storage, teams } = usage;
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState(initialSeats);
  const [addons, setAddons] = useState(initialAddons);
  const [sponsorInput, setSponsorInput] = useState("");
  const [sponsoring, setSponsoring] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancellingAddonId, setCancellingAddonId] = useState<string | null>(
    null,
  );
  const [sponsorError, setSponsorError] = useState("");
  const [leavingSponsorship, setLeavingSponsorship] = useState(false);
  const [sponsorshipLeft, setSponsorshipLeft] = useState(false);

  const isActive =
    subscription?.status === "active" || subscription?.status === "comp";
  const hasAccess = isActive || (!!sponsoredBy && !sponsorshipLeft);

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

  async function handleSponsor(e: React.FormEvent) {
    e.preventDefault();
    if (!sponsorInput.trim()) return;
    setSponsorError("");
    setSponsoring(true);

    const res = await fetch("/api/sponsorship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handleOrEmail: sponsorInput.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setSponsorError(data.error ?? "Failed to sponsor");
      setSponsoring(false);
      return;
    }

    const seat: SponsoredSeat = await res.json();
    setSeats((prev) => [seat, ...prev]);
    setSponsorInput("");
    setSponsoring(false);
  }

  async function handleUnsponsor(seat: SponsoredSeat) {
    const displayName = seat.userHandle
      ? `@${seat.userHandle}`
      : (seat.userName ?? seat.userEmail);
    if (
      !confirm(
        `Stop sponsoring ${displayName}? They will lose their membership unless they pay for it themselves.`,
      )
    )
      return;

    setRemovingId(seat.id);
    const res = await fetch(`/api/sponsorship/${seat.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSeats((prev) => prev.filter((s) => s.id !== seat.id));
    }
    setRemovingId(null);
  }

  async function handleLeaveSponsorship() {
    if (
      !confirm(
        `Leave sponsorship from ${sponsoredBy?.sponsorName}? You'll keep access until ${sponsoredBy?.currentPeriodEnd ? formatDate(sponsoredBy.currentPeriodEnd) : "the end of the billing period"}, then you'll need your own subscription.`,
      )
    )
      return;

    setLeavingSponsorship(true);
    const res = await fetch("/api/sponsorship/leave", { method: "POST" });
    if (res.ok) {
      setSponsorshipLeft(true);
    }
    setLeavingSponsorship(false);
  }

  async function handleBuyStoragePack(beneficiaryId?: string) {
    setLoading(true);
    const res = await fetch("/api/billing/storage-addon/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(beneficiaryId ? { beneficiaryId } : {}),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  async function handleCancelAddon(addonId: string) {
    if (
      !confirm(
        "Cancel this storage pack? It will remain active until the end of the current billing period.",
      )
    )
      return;

    setCancellingAddonId(addonId);
    const res = await fetch(`/api/billing/storage-addon/${addonId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAddons((prev) =>
        prev.map((a) => (a.id === addonId ? { ...a, status: "cancelled" } : a)),
      );
    }
    setCancellingAddonId(null);
  }

  const config =
    statusConfig[subscription?.status ?? "inactive"] ?? statusConfig.inactive;

  // Calculate over-quota warning for expiring packs
  const expiringPacks = addons.filter(
    (a) => a.status === "cancelled" && a.currentPeriodEnd,
  );
  const activePackCount = addons.filter((a) => a.status === "active").length;
  const futureQuota =
    storage.quotaBytes - expiringPacks.length * 10 * 1024 * 1024 * 1024;
  const willBeOverQuota =
    expiringPacks.length > 0 && storage.usedBytes > futureQuota;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and storage usage.
        </p>
      </div>

      {/* Sponsored Membership Card */}
      {sponsoredBy && !sponsorshipLeft && !isActive && (
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-cyan-500" />
              Sponsored Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Your membership is sponsored by{" "}
              <strong>{sponsoredBy.sponsorName}</strong>.
            </p>
            {sponsoredBy.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Current period ends {formatDate(sponsoredBy.currentPeriodEnd)}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveSponsorship}
                disabled={leavingSponsorship}
              >
                {leavingSponsorship ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : null}
                Leave Sponsorship
              </Button>
              <Button
                size="sm"
                onClick={handleSubscribe}
                disabled={loading}
                className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                {loading ? "Loading..." : "Subscribe Myself — $10/mo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                      {formatDate(subscription.currentPeriodEnd)}
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
          {willBeOverQuota && (
            <div className="flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium text-amber-600 dark:text-amber-400">
                  Storage pack expiring soon
                </p>
                <p className="text-muted-foreground">
                  You&apos;re using {formatBytes(storage.usedBytes)} but will
                  only have {formatBytes(Math.max(0, futureQuota))} after{" "}
                  {expiringPacks.length} pack
                  {expiringPacks.length === 1 ? "" : "s"} expire
                  {expiringPacks[0]?.currentPeriodEnd
                    ? ` on ${formatDate(expiringPacks[0].currentPeriodEnd)}`
                    : ""}
                  . Move files to local storage, use your own S3 bucket, or buy
                  another pack to avoid losing data.
                </p>
              </div>
            </div>
          )}

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
            5 GB included per seat
            {storage.addonBytes > 0
              ? ` + ${formatBytes(storage.addonBytes)} from storage packs`
              : ""}
            . Teams pool storage across seats (e.g. 5 seats = 25 GB shared).
          </p>
        </CardContent>
      </Card>

      {/* Storage Packs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Packs
          </CardTitle>
          <CardDescription>
            Add 10 GB of cloud storage for $5/mo per pack. Buy for yourself or
            gift to someone you sponsor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addons.length > 0 && (
            <div className="space-y-2">
              {addons.map((addon) => {
                const isCancelled = addon.status === "cancelled";
                let label = "10 GB pack — $5/mo";
                if (addon.type === "received") {
                  label = `10 GB pack — gifted by ${addon.purchaserName ?? addon.purchaserEmail ?? "sponsor"}`;
                } else if (addon.type === "gifted") {
                  label = `10 GB pack → ${addon.beneficiaryName ?? addon.beneficiaryEmail ?? "sponsee"}`;
                }

                return (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md border"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                        <p className="text-sm font-medium truncate">{label}</p>
                        {isCancelled && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            Cancels{" "}
                            {addon.currentPeriodEnd
                              ? formatDate(addon.currentPeriodEnd)
                              : "soon"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!isCancelled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleCancelAddon(addon.id)}
                        disabled={cancellingAddonId === addon.id}
                      >
                        {cancellingAddonId === addon.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground pt-1">
                {activePackCount} active pack{activePackCount === 1 ? "" : "s"}{" "}
                &middot; ${activePackCount * 5}/mo
              </p>
            </div>
          )}

          {hasAccess && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBuyStoragePack()}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add 10 GB Pack — $5/mo
            </Button>
          )}

          {!hasAccess && addons.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Subscribe to Pro to purchase storage packs.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sponsored Seats */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Sponsored Seats
            </CardTitle>
            <CardDescription>
              Gift someone a Trinity membership by their handle or email. $10/mo
              per seat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSponsor} className="flex gap-2 mb-4">
              <Input
                placeholder="handle or email@example.com"
                value={sponsorInput}
                onChange={(e) => {
                  setSponsorInput(e.target.value);
                  setSponsorError("");
                }}
                className="max-w-xs"
              />
              <Button
                type="submit"
                size="sm"
                disabled={sponsoring || !sponsorInput.trim()}
              >
                {sponsoring ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-1.5" />
                )}
                Sponsor
              </Button>
            </form>

            {sponsorError && (
              <p className="text-sm text-destructive mb-3">{sponsorError}</p>
            )}

            {seats.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                You&apos;re not sponsoring anyone yet.
              </p>
            ) : (
              <div className="space-y-2">
                {seats.map((seat) => {
                  const displayName = seat.userHandle
                    ? `@${seat.userHandle}`
                    : (seat.userName ?? seat.userEmail);

                  return (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md border"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {seat.userEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-muted-foreground"
                          onClick={() => handleBuyStoragePack(seat.userId)}
                          disabled={loading}
                          title="Gift a 10 GB storage pack"
                        >
                          <Package className="w-3.5 h-3.5 mr-1" />
                          Gift Storage
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleUnsponsor(seat)}
                          disabled={removingId === seat.id}
                        >
                          {removingId === seat.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground pt-1">
                  {seats.length} sponsored seat{seats.length === 1 ? "" : "s"}{" "}
                  &middot; ${seats.length * 10}/mo
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BillingPage() {
  const [usagePromise] = useState(() => fetchUsage());
  const [seatsPromise] = useState(() => fetchSeats());
  const [addonsPromise] = useState(() => fetchAddons());

  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingContent
        usagePromise={usagePromise}
        seatsPromise={seatsPromise}
        addonsPromise={addonsPromise}
      />
    </Suspense>
  );
}
