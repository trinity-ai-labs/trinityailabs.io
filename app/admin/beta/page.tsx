"use client";

import { useState, use, Suspense, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
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
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface BetaSignup {
  id: string;
  email: string;
  name: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

function fetchSignups(status?: string): Promise<BetaSignup[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  return fetch(`/api/admin/beta?${params}`)
    .then((r) => r.json())
    .then((data) => data.signups ?? []);
}

function BetaSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 bg-muted animate-pulse rounded" />
      <div className="h-10 w-80 bg-muted animate-pulse rounded" />
      <div className="rounded-md border">
        <div className="h-12 border-b bg-muted/30" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 border-b flex items-center gap-4 px-4">
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BetaTable({
  signupsPromise,
  onRefresh,
}: {
  signupsPromise: Promise<BetaSignup[]>;
  onRefresh: () => void;
}) {
  const signups = use(signupsPromise);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

  async function handleAction() {
    if (!actionId || !actionType) return;
    setProcessing(true);
    try {
      await fetch(`/api/admin/beta/${actionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionType === "approve" ? "approved" : "rejected",
        }),
      });
      onRefresh();
    } finally {
      setProcessing(false);
      setActionId(null);
      setActionType(null);
    }
  }

  const columns: ColumnDef<BetaSignup>[] = [
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.name ?? "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={STATUS_VARIANTS[row.original.status] ?? "outline"}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Applied",
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
        const signup = row.original;
        if (signup.status !== "pending") return null;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setActionId(signup.id);
                setActionType("approve");
              }}
              title="Approve"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setActionId(signup.id);
                setActionType("reject");
              }}
              title="Reject"
            >
              <XCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={signups}
        searchKey="email"
        searchPlaceholder="Search by email..."
      />

      <AlertDialog
        open={!!actionId}
        onOpenChange={(open) => {
          if (!open) {
            setActionId(null);
            setActionType(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Approve beta tester?"
                : "Reject application?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? "This will create an invite with free access and send them an email to get started."
                : "This will send them a rejection email."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={processing}>
              {processing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {actionType === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const FILTER_STATUSES = ["all", "pending", "approved", "rejected"] as const;

export default function AdminBetaPage() {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [signupsPromise, setSignupsPromise] = useState(() => fetchSignups());

  const refresh = useCallback(() => {
    setSignupsPromise(
      fetchSignups(activeStatus === "all" ? undefined : activeStatus),
    );
  }, [activeStatus]);

  const filterByStatus = useCallback((status: string) => {
    setActiveStatus(status);
    setSignupsPromise(fetchSignups(status === "all" ? undefined : status));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Beta Applications</h1>

      <div className="flex gap-2">
        {FILTER_STATUSES.map((s) => (
          <Button
            key={s}
            variant={activeStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus(s)}
            className="capitalize"
          >
            {s}
          </Button>
        ))}
      </div>

      <Suspense fallback={<BetaSkeleton />}>
        <BetaTable signupsPromise={signupsPromise} onRefresh={refresh} />
      </Suspense>
    </div>
  );
}
