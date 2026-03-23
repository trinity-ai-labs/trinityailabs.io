const REPO = "trinity-ai-labs/trinity";

interface GitHubStats {
  totalCommits: number;
  linesAdded: number;
  daysBuilding: number;
  contributors: number;
}

const FALLBACK_STATS: GitHubStats = {
  totalCommits: 1300,
  linesAdded: 455000,
  daysBuilding: 48,
  contributors: 2,
};

export async function getGitHubStats(): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return FALLBACK_STATS;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const [repoRes, commitsRes, contributorsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/commits?per_page=1`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/stats/contributors`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    // Total commits from Link header pagination
    const linkHeader = commitsRes.headers.get("link") || "";
    const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
    const totalCommits = lastPageMatch
      ? parseInt(lastPageMatch[1], 10)
      : FALLBACK_STATS.totalCommits;

    // Days building from repo creation date
    const repoData = await repoRes.json();
    const createdAt = new Date(repoData.created_at);
    const now = new Date();
    const daysBuilding = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Lines added & contributor count from contributors stats
    let linesAdded = FALLBACK_STATS.linesAdded;
    let contributors = FALLBACK_STATS.contributors;
    const contributorsData = await contributorsRes.json();
    if (Array.isArray(contributorsData)) {
      contributors = contributorsData.length;
      linesAdded = contributorsData.reduce(
        (sum: number, c: { weeks: { a: number }[] }) =>
          sum + c.weeks.reduce((s: number, w: { a: number }) => s + w.a, 0),
        0
      );
    }

    return { totalCommits, linesAdded, daysBuilding, contributors };
  } catch {
    return FALLBACK_STATS;
  }
}
