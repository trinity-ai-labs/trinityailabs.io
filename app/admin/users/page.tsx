"use client";

import { useState, use, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Eye, Gift, XCircle } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  createdAt: string;
  sub_status: string | null;
  lemonsqueezy_subscription_id: string | null;
}

function fetchUsersData(): Promise<UserRow[]> {
  return fetch("/api/admin/users")
    .then((r) => r.json())
    .then((data) => data.users ?? []);
}

function roleBadge(role: string | null) {
  if (role === "admin") return <Badge>Admin</Badge>;
  return <Badge variant="secondary">{role ?? "user"}</Badge>;
}

function subBadge(status: string | null) {
  if (!status) return <Badge variant="outline">None</Badge>;
  const map: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    comp: "secondary",
    cancelled: "destructive",
    paused: "outline",
    past_due: "destructive",
  };
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>;
}

function UsersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      <div className="h-10 w-80 bg-muted animate-pulse rounded" />
      <div className="rounded-md border">
        <div className="h-12 border-b bg-muted/30" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 border-b flex items-center gap-4 px-4">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTable({
  usersPromise,
  onRefresh,
}: {
  usersPromise: Promise<UserRow[]>;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const users = use(usersPromise);
  const [cancellingSubId, setCancellingSubId] = useState<string | null>(null);

  async function compUser(userId: string) {
    await fetch(`/api/admin/users/${userId}/comp`, { method: "POST" });
    onRefresh();
  }

  async function cancelSub(subId: string) {
    await fetch(`/api/admin/subscriptions/${subId}/cancel`, {
      method: "POST",
    });
    setCancellingSubId(null);
    onRefresh();
  }

  const columns: ColumnDef<UserRow>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => roleBadge(row.getValue("role")),
    },
    {
      accessorKey: "sub_status",
      header: "Subscription",
      cell: ({ row }) => subBadge(row.getValue("sub_status")),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return date
          ? new Date(date).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {user.sub_status !== "active" && user.sub_status !== "comp" && (
                <DropdownMenuItem onClick={() => compUser(user.id)}>
                  <Gift className="w-4 h-4 mr-2" />
                  Comp Access
                </DropdownMenuItem>
              )}
              {user.lemonsqueezy_subscription_id &&
                user.sub_status === "active" && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setCancellingSubId(
                        user.lemonsqueezy_subscription_id!,
                      )
                    }
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        searchKey="email"
        searchPlaceholder="Search by email..."
      />
      <AlertDialog
        open={!!cancellingSubId}
        onOpenChange={(open) => !open && setCancellingSubId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the user&apos;s active subscription via Lemon
              Squeezy. This action cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Active</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (cancellingSubId) cancelSub(cancellingSubId);
              }}
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminUsersPage() {
  const [usersPromise, setUsersPromise] = useState(() => fetchUsersData());

  const refresh = useCallback(() => {
    setUsersPromise(fetchUsersData());
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersTable usersPromise={usersPromise} onRefresh={refresh} />
      </Suspense>
    </div>
  );
}
