export type Platform = "macos-arm" | "macos-intel" | "linux" | "unknown";

function getGPURenderer(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return null;
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
  } catch {
    return null;
  }
}

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("mac")) {
    const gpu = getGPURenderer();
    if (gpu && /intel/i.test(gpu)) return "macos-intel";
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
  if (platform === "unknown") {
    return "https://github.com/trinity-ai-labs/trinity/releases/latest";
  }
  return `/api/download/${platform}`;
}
