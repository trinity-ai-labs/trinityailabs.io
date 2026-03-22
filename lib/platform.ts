export type Platform = "macos-arm" | "macos-intel" | "linux" | "unknown";

const RELEASE_BASE =
  "https://github.com/trinity-ai-labs/trinity/releases/latest/download";

const VERSION = "0.1.0";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("mac")) {
    // Best-effort Apple Silicon detection — defaults to ARM since most
    // Macs sold since late 2020 are Apple Silicon
    try {
      if (navigator.platform === "MacIntel" && !("ontouchend" in document)) {
        return "macos-intel";
      }
    } catch {
      // fallback
    }
    return "macos-arm";
  }
  if (ua.includes("linux")) return "linux";

  return "unknown";
}

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "macos-arm":
      return "macOS (Apple Silicon)";
    case "macos-intel":
      return "macOS (Intel)";
    case "linux":
      return "Linux";
    default:
      return "your platform";
  }
}

export function getDownloadUrl(platform: Platform): string {
  switch (platform) {
    case "macos-arm":
      return `${RELEASE_BASE}/Trinity_${VERSION}_aarch64.dmg`;
    case "macos-intel":
      return `${RELEASE_BASE}/Trinity_${VERSION}_x64.dmg`;
    case "linux":
      return `${RELEASE_BASE}/trinity_${VERSION}_amd64.AppImage`;
    default:
      return "https://github.com/trinity-ai-labs/trinity/releases/latest";
  }
}
