"use client";

import { useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  user_id: string;
  lemonsqueezy_subscription_id: string | null;
  lemonsqueezy_customer_id: string | null;
  status: string;
  current_period_end: string | null;
}

interface UserData {
  user: UserDetail;
  subscription: Subscription | null;
}

function fetchUserData(id: string): Promise<UserData> {
  return fetch(`/api/admin/users/${id}`).then((r) => r.json());
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      <Card>
        <CardHeader>
          <div className="h-5 w-20 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-28 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          <div className="flex gap-2 pt-4 border-t">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDetailContent({
  dataPromise,
  id,
}: {
  dataPromise: Promise<UserData>;
  id: string;
}) {
  const router = useRouter();
  const initialData = use(dataPromise);
  const [user, setUser] = useState(initialData.user);
  const [subscription, setSubscription] = useState(initialData.subscription);
  const [acting, setActing] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    description: string;
    label: string;
    url: string;
    method: string;
  } | null>(null);

  async function act(url: string, method = "POST") {
    setActing(true);
    await fetch(url, { method });
    const data = await fetch(`/api/admin/users/${id}`).then((r) => r.json());
    setUser(data.user);
    setSubscription(data.subscription);
    setActing(false);
  }

  const subId = subscription?.lemonsqueezy_subscription_id;
  const status = subscription?.status;

  return (
    <div className="space-y-6 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admin/users")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row
            label="Role"
            value={
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role ?? "user"}
              </Badge>
            }
          />
          <Row
            label="Joined"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscription ? (
            <>
              <Row
                label="Status"
                value={
                  <Badge
                    variant={
                      status === "active" || status === "comp"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {status}
                  </Badge>
                }
              />
              {subId && <Row label="LS Subscription ID" value={subId} />}
              {subscription.lemonsqueezy_customer_id && (
                <Row
                  label="LS Customer ID"
                  value={subscription.lemonsqueezy_customer_id}
                />
              )}
              {subscription.current_period_end && (
                <Row
                  label="Current Period End"
                  value={new Date(
                    subscription.current_period_end,
                  ).toLocaleDateString()}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No subscription</p>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {subId && status === "active" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={acting}
                  onClick={() => act(`/api/admin/subscriptions/${subId}/pause`)}
                >
                  Pause
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={acting}
                  onClick={() =>
                    setPendingAction({
                      title: "Cancel subscription?",
                      description:
                        "This will cancel the user's active subscription via Lemon Squeezy.",
                      label: "Cancel Subscription",
                      url: `/api/admin/subscriptions/${subId}/cancel`,
                      method: "POST",
                    })
                  }
                >
                  Cancel
                </Button>
              </>
            )}
            {subId && status === "paused" && (
              <Button
                size="sm"
                disabled={acting}
                onClick={() => act(`/api/admin/subscriptions/${subId}/resume`)}
              >
                Resume
              </Button>
            )}
            {status !== "active" && status !== "comp" && (
              <Button
                variant="outline"
                size="sm"
                disabled={acting}
                onClick={() => act(`/api/admin/users/${id}/comp`)}
              >
                Grant Comp Access
              </Button>
            )}
            {status === "comp" && (
              <Button
                variant="destructive"
                size="sm"
                disabled={acting}
                onClick={() =>
                  setPendingAction({
                    title: "Revoke comp access?",
                    description:
                      "This will immediately remove the user's complimentary subscription.",
                    label: "Revoke",
                    url: `/api/admin/users/${id}/comp`,
                    method: "DELETE",
                  })
                }
              >
                Revoke Comp
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pendingAction) act(pendingAction.url, pendingAction.method);
                setPendingAction(null);
              }}
            >
              {pendingAction?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dataPromise] = useState(() => fetchUserData(id));

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailContent dataPromise={dataPromise} id={id} />
    </Suspense>
  );
}
