/**
 * Format a blog date for display. Dates are stored as UTC timestamps
 * in frontmatter (e.g. "2026-03-27T00:00:00Z") and always displayed in UTC
 * so the date never shifts across timezones.
 */
export function formatBlogDate(
  dateStr: string,
  style: "long" | "short" = "long",
): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}
