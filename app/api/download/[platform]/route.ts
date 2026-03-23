import { NextResponse } from "next/server";

const RELEASES_BASE = "https://releases.trinityailabs.com/releases";
const LATEST_URL = `${RELEASES_BASE}/latest.json`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;

  try {
    const res = await fetch(LATEST_URL, { next: { revalidate: 300 } });
    if (!res.ok) {
      return NextResponse.json({ error: "No releases available" }, { status: 404 });
    }

    const latest: { version: string } = await res.json();
    const version = latest.version;

    const urls: Record<string, string> = {
      "macos-arm": `${RELEASES_BASE}/${version}/Trinity_${version}_aarch64.dmg`,
      "macos-intel": `${RELEASES_BASE}/${version}/Trinity_${version}_x86_64.dmg`,
      linux: `${RELEASES_BASE}/${version}/Trinity_${version}_amd64.deb`,
    };

    const url = urls[platform];
    if (!url) {
      return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
    }

    return NextResponse.redirect(url, 302);
  } catch {
    return NextResponse.json({ error: "Failed to fetch release info" }, { status: 502 });
  }
}
