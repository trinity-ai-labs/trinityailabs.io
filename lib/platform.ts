export type Platform = "macos" | "windows" | "linux" | "unknown";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("mac")) return "macos";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";

  return "unknown";
}

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "macos":
      return "macOS";
    case "windows":
      return "Windows";
    case "linux":
      return "Linux";
    default:
      return "your platform";
  }
}

export function getDownloadUrl(platform: Platform): string {
  // Placeholder URLs — replace with actual app store / download links
  switch (platform) {
    case "macos":
      return "#download-macos";
    case "windows":
      return "#download-windows";
    case "linux":
      return "#download-linux";
    default:
      return "#downloads";
  }
}
