"use client";

import { useState, use, Suspense, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Users, CreditCard, DollarSign, XCircle } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  cancelledCount: number;
  signupsPerDay: { date: string; count: number }[];
  subscriptionBreakdown: Record<string, number>;
}

const signupsChartConfig: ChartConfig = {
  count: { label: "Signups", color: "#10b981" },
};

const subChartConfig: ChartConfig = {
  active: { label: "Active", color: "#10b981" },
  comp: { label: "Comp", color: "#06b6d4" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
  paused: { label: "Paused", color: "#f59e0b" },
  past_due: { label: "Past Due", color: "#8b5cf6" },
};

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  comp: "#06b6d4",
  cancelled: "#ef4444",
  paused: "#f59e0b",
  past_due: "#8b5cf6",
  inactive: "#6b7280",
};

function fetchStats(): Promise<Stats> {
  return fetch("/api/admin/stats").then((r) => r.json());
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-44 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-5 w-44 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted/30 animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 w-52 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted/30 animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OverviewContent({ statsPromise }: { statsPromise: Promise<Stats> }) {
  const stats = use(statsPromise);

  const pieData = Object.entries(stats.subscriptionBreakdown).map(
    ([status, count]) => ({
      name: status,
      value: count,
    }),
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={CreditCard}
        />
        <StatCard title="MRR" value={`$${stats.mrr}`} icon={DollarSign} />
        <StatCard
          title="Cancelled"
          value={stats.cancelledCount}
          icon={XCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Signups (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.signupsPerDay.length > 0 ? (
              <ChartContainer
                config={signupsChartConfig}
                className="h-[250px] w-full !aspect-auto"
              >
                <BarChart data={stats.signupsPerDay}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) =>
                      new Date(d).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">
                No signups in the last 30 days
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="space-y-4">
                <ChartContainer
                  config={subChartConfig}
                  className="h-[200px] w-full !aspect-auto"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={pieData.length > 1 ? 2 : 0}
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name] ?? "#6b7280"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {pieData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[entry.name] ?? "#6b7280",
                        }}
                      />
                      <span className="text-muted-foreground capitalize">
                        {entry.name.replace("_", " ")}
                      </span>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">
                No subscriptions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <Icon className="w-8 h-8 text-muted-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const [statsPromise] = useState(() => fetchStats());

  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewContent statsPromise={statsPromise} />
    </Suspense>
  );
}
