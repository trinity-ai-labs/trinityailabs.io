"use client";

import { useState, use } from "react";
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
import { MoreHorizontal, Eye, Gift, XCircle } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: number | null;
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
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    comp: "secondary",
    cancelled: "destructive",
    paused: "outline",
    past_due: "destructive",
  };
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [usersPromise, setUsersPromise] = useState(() => fetchUsersData());
  const users = use(usersPromise);

  function refresh() {
    setUsersPromise(fetchUsersData());
  }

  async function compUser(userId: string) {
    await fetch(`/api/admin/users/${userId}/comp`, { method: "POST" });
    refresh();
  }

  async function cancelSub(subId: string) {
    await fetch(`/api/admin/subscriptions/${subId}/cancel`, {
      method: "POST",
    });
    refresh();
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
                      cancelSub(user.lemonsqueezy_subscription_id!)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable
        columns={columns}
        data={users}
        searchKey="email"
        searchPlaceholder="Search by email..."
      />
    </div>
  );
}
