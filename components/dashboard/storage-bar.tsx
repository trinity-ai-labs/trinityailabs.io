"use client";

import { cn } from "@/lib/utils";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

interface StorageBarProps {
  usedBytes: number;
  quotaBytes: number;
  label?: string;
}

export function StorageBar({ usedBytes, quotaBytes, label }: StorageBarProps) {
  const pct = quotaBytes > 0 ? (usedBytes / quotaBytes) * 100 : 0;

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="flex justify-between text-sm">
        <span>
          {formatBytes(usedBytes)} of {formatBytes(quotaBytes)} used
        </span>
        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct > 95
              ? "bg-red-500"
              : pct > 80
                ? "bg-amber-500"
                : "bg-emerald-500",
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
