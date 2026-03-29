"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import {
  BUG_REPORT_STATUSES,
  STATUS_VARIANTS,
  BUG_REPORT_QUALITIES,
} from "@/lib/bug-reports";

interface BugReport {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  title: string;
  description: string;
  app_version: string | null;
  os: string | null;
  route: string | null;
  status: string;
  admin_notes: string | null;
  quality: string | null;
  created_at: string;
  updated_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  storage_key: string;
  content_type: string;
  file_size: number | null;
  url: string;
}

export default function BugReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<BugReport | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [quality, setQuality] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetch(`/api/bug-reports/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setReport(data.report);
        setAttachments(data.attachments ?? []);
        setStatus(data.report.status);
        setQuality(data.report.quality ?? "");
        setAdminNotes(data.report.admin_notes ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/bug-reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes,
          quality: quality || null,
        }),
      });
      if (res.ok && report) {
        setReport({ ...report, status, admin_notes: adminNotes, quality });
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Bug report not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/bug-reports")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bug Reports
      </Button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{report.title}</h1>
        <Badge
          variant={STATUS_VARIANTS[report.status] ?? "outline"}
          className="capitalize"
        >
          {report.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Info */}
        <Card>
          <CardHeader>
            <CardTitle>Report Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reporter</span>
              <span>{report.user_name ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{report.user_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Version</span>
              <span>{report.app_version ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">OS</span>
              <span>{report.os ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route</span>
              <span className="font-mono text-xs">{report.route ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>
                {new Date(report.created_at).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {BUG_REPORT_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Not rated</option>
                {BUG_REPORT_QUALITIES.map((q) => (
                  <option key={q} value={q} className="capitalize">
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Internal notes..."
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{report.description}</p>
        </CardContent>
      </Card>

      {/* Attachments */}
      {attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments ({attachments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-lg border overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  {att.content_type.startsWith("image/") ? (
                    <Image
                      src={att.url}
                      alt={att.file_name}
                      width={320}
                      height={160}
                      className="w-full h-40 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">
                        {att.file_name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-2 text-xs truncate">{att.file_name}</div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
