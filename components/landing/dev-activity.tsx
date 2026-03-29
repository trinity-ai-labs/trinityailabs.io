import { GitCommit, Code2, Calendar, Flame } from "lucide-react";

interface DevActivityProps {
  totalCommits: number;
  linesAdded: number;
  daysBuilding: number;
  contributors: number;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

const stats = [
  {
    key: "totalCommits" as const,
    label: "Commits",
    icon: GitCommit,
  },
  {
    key: "linesAdded" as const,
    label: "Lines Written",
    icon: Code2,
  },
  {
    key: "daysBuilding" as const,
    label: "Days Building",
    icon: Calendar,
    raw: true,
  },
  {
    key: "commitsPerDay" as const,
    label: "Commits / Day",
    icon: Flame,
    raw: true,
  },
];

export function DevActivity(props: DevActivityProps) {
  const commitsPerDay = Math.round(props.totalCommits / props.daysBuilding);

  const values = {
    ...props,
    commitsPerDay,
  };

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-mono text-emerald-400 uppercase tracking-wider mb-3">
            Live from our private repo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            We ship. A lot.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Trinity is in beta — but we&apos;re building at full speed. These
            numbers are pulled straight from our GitHub repo, updated every
            hour.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const value = values[stat.key];
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="rounded-xl border border-border bg-card/50 p-6 text-center hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold font-mono text-foreground mb-1">
                  {"raw" in stat && stat.raw
                    ? value.toLocaleString()
                    : formatNumber(value)}
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
