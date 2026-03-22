import { NextResponse } from "next/server";

const GITHUB_RELEASES_URL =
  "https://api.github.com/repos/trinity-ai-labs/trinity/releases?per_page=1";

const FALLBACK_URL =
  "https://github.com/trinity-ai-labs/trinity/releases/latest";

const ASSET_PATTERNS: Record<string, RegExp> = {
  "macos-arm": /_aarch64\.dmg$/,
  "macos-intel": /_x64\.dmg$/,
  linux: /_amd64\.AppImage$/,
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const pattern = ASSET_PATTERNS[platform];

  if (!pattern) {
    return NextResponse.redirect(FALLBACK_URL, 302);
  }

  try {
    const res = await fetch(GITHUB_RELEASES_URL, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.redirect(FALLBACK_URL, 302);
    }

    const releases = await res.json();
    const release = releases[0];

    if (!release) {
      return NextResponse.redirect(FALLBACK_URL, 302);
    }

    const asset = release.assets?.find((a: { name: string }) =>
      pattern.test(a.name),
    );

    if (!asset?.browser_download_url) {
      return NextResponse.redirect(FALLBACK_URL, 302);
    }

    return NextResponse.redirect(asset.browser_download_url, 302);
  } catch {
    return NextResponse.redirect(FALLBACK_URL, 302);
  }
}
