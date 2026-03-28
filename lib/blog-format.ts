const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format a YYYY-MM-DD date string without timezone ambiguity.
 * Parses the components directly — never goes through `new Date()` UTC.
 */
export function formatBlogDate(
  dateStr: string,
  style: "long" | "short" = "long",
): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = style === "long" ? MONTHS_LONG : MONTHS_SHORT;
  return `${months[m - 1]} ${d}, ${y}`;
}
