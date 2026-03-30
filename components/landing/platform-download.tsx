"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Apple } from "lucide-react";
import {
  detectPlatform,
  getPlatformLabel,
  getDownloadUrl,
  type Platform,
} from "@/lib/platform";

export function PlatformDownload({ size = "lg" }: { size?: "default" | "lg" }) {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    const detected = detectPlatform();
    Promise.resolve().then(() => setPlatform(detected));
  }, []);

  const label =
    platform === "unknown"
      ? "Download"
      : `Download for ${getPlatformLabel(platform)}`;
  const url = getDownloadUrl(platform);

  return (
    <Button
      asChild
      size={size}
      className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20"
    >
      <a href={url}>
        <Download className="mr-2 w-4 h-4" />
        {label}
      </a>
    </Button>
  );
}

export function DownloadButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Button
        asChild
        size="lg"
        className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white w-full sm:w-auto"
      >
        <a href={getDownloadUrl("macos-arm")}>
          <Apple className="mr-2 w-4 h-4" />
          macOS (Apple Silicon)
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="font-mono w-full sm:w-auto"
      >
        <a href={getDownloadUrl("macos-intel")}>
          <Apple className="mr-2 w-4 h-4" />
          macOS (Intel)
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="font-mono w-full sm:w-auto"
      >
        <a href={getDownloadUrl("linux")}>
          <Download className="mr-2 w-4 h-4" />
          Linux
        </a>
      </Button>
    </div>
  );
}
