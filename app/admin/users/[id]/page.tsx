"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setSubscription(data.subscription);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function act(url: string, method = "POST") {
    setActing(true);
    await fetch(url, { method });
    const data = await fetch(`/api/admin/users/${id}`).then((r) => r.json());
    setUser(data.user);
    setSubscription(data.subscription);
    setActing(false);
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
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
                    subscription.current_period_end
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
                  onClick={() =>
                    act(`/api/admin/subscriptions/${subId}/pause`)
                  }
                >
                  Pause
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={acting}
                  onClick={() =>
                    act(`/api/admin/subscriptions/${subId}/cancel`)
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
                onClick={() =>
                  act(`/api/admin/subscriptions/${subId}/resume`)
                }
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
                onClick={() => act(`/api/admin/users/${id}/comp`, "DELETE")}
              >
                Revoke Comp
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
