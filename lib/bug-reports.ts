export const BUG_REPORT_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

export type BugReportStatus = (typeof BUG_REPORT_STATUSES)[number];

export const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "outline",
  in_progress: "secondary",
  resolved: "default",
  closed: "destructive",
};
