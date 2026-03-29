"use client";

import { useState, use, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { BUG_REPORT_STATUSES, STATUS_VARIANTS } from "@/lib/bug-reports";

interface BugReportRow {
  id: string;
  title: string;
  user_email: string;
  user_name: string | null;
  status: string;
  app_version: string | null;
  os: string | null;
  created_at: string;
}

function fetchBugReports(status?: string): Promise<BugReportRow[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  return fetch(`/api/bug-reports?${params}`)
    .then((r) => r.json())
    .then((data) => data.reports ?? []);
}

function statusBadge(status: string) {
  const label = status.replace("_", " ");
  return (
    <Badge
      variant={STATUS_VARIANTS[status] ?? "outline"}
      className="capitalize"
    >
      {label}
    </Badge>
  );
}

function BugReportsSkeleton() {
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

function BugReportsTable({
  reportsPromise,
}: {
  reportsPromise: Promise<BugReportRow[]>;
}) {
  const router = useRouter();
  const reports = use(reportsPromise);

  const columns: ColumnDef<BugReportRow>[] = [
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "user_email",
      header: "Reporter",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.user_name ?? row.original.user_email}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.getValue("status")),
    },
    {
      accessorKey: "created_at",
      header: "Submitted",
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
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/admin/bug-reports/${row.original.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={reports}
      searchKey="title"
      searchPlaceholder="Search by title..."
    />
  );
}

const FILTER_STATUSES = ["all", ...BUG_REPORT_STATUSES] as const;

export default function AdminBugReportsPage() {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [reportsPromise, setReportsPromise] = useState(() => fetchBugReports());

  const filterByStatus = useCallback((status: string) => {
    setActiveStatus(status);
    setReportsPromise(fetchBugReports(status === "all" ? undefined : status));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bug Reports</h1>

      <div className="flex gap-2">
        {FILTER_STATUSES.map((s) => (
          <Button
            key={s}
            variant={activeStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus(s)}
            className="capitalize"
          >
            {s.replace("_", " ")}
          </Button>
        ))}
      </div>

      <Suspense fallback={<BugReportsSkeleton />}>
        <BugReportsTable reportsPromise={reportsPromise} />
      </Suspense>
    </div>
  );
}
