"use client";

import { useState, use } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface Invite {
  id: string;
  email: string;
  token: string;
  free_access: number;
  invited_by: string;
  used: number;
  created_at: string;
}

function fetchInvitesData(): Promise<Invite[]> {
  return fetch("/api/admin/invites")
    .then((r) => r.json())
    .then((data) => data.invites ?? []);
}

export default function AdminInvitesPage() {
  const [invitesPromise, setInvitesPromise] = useState(() => fetchInvitesData());
  const invites = use(invitesPromise);
  const [email, setEmail] = useState("");
  const [freeAccess, setFreeAccess] = useState(false);
  const [sending, setSending] = useState(false);

  function refresh() {
    setInvitesPromise(fetchInvitesData());
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, freeAccess }),
    });
    setEmail("");
    setFreeAccess(false);
    setSending(false);
    refresh();
  }

  async function revokeInvite(id: string) {
    await fetch(`/api/admin/invites/${id}`, { method: "DELETE" });
    refresh();
  }

  const columns: ColumnDef<Invite>[] = [
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "free_access",
      header: "Free Access",
      cell: ({ row }) =>
        row.getValue("free_access") ? (
          <Badge>Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      accessorKey: "used",
      header: "Status",
      cell: ({ row }) =>
        row.getValue("used") ? (
          <Badge variant="secondary">Used</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        ),
    },
    {
      accessorKey: "created_at",
      header: "Sent",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
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
        const invite = row.original;
        if (invite.used) return null;
        return (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => revokeInvite(invite.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invitations</h1>

      <form onSubmit={sendInvite} className="flex items-end gap-4">
        <div className="flex-1 max-w-sm">
          <label
            htmlFor="invite-email"
            className="block text-sm font-medium mb-1.5"
          >
            Email
          </label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={freeAccess}
            onChange={(e) => setFreeAccess(e.target.checked)}
            className="rounded"
          />
          Grant free access
        </label>
        <Button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send Invite"}
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={invites}
        searchKey="email"
        searchPlaceholder="Search by email..."
      />
    </div>
  );
}
