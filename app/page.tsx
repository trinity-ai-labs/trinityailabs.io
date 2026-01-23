import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Zap,
  RefreshCw,
  Terminal,
  Layers,
  ArrowRight,
  Cpu,
  GitMerge
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-32">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
              <span className="font-mono font-bold text-xl">trinity</span>
            </div>
            <Badge variant="secondary" className="font-mono">
              Coming Soon
            </Badge>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-border bg-card/50 backdrop-blur">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">Autonomous AI Development</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build while you&apos;re{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                AFK
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Point Trinity at your project, define your stories, and let it build.
              Parallel features, smart orchestration, crash recovery.
              Wake up to PRs, not problems.
            </p>

            {/* Terminal preview */}
            <div className="mb-8 rounded-lg border border-border bg-card overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-muted-foreground text-xs">terminal</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">$</span>
                  <span>trinity run --all</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400">[auth]</span> STORY-1.1.2 Implementing login... ✓
                </div>
                <div className="text-muted-foreground">
                  <span className="text-yellow-400">[payments]</span> STORY-2.1.1 Adding Stripe...
                </div>
                <div className="text-muted-foreground">
                  <span className="text-purple-400">[notifications]</span> STORY-3.1.1 Email setup...
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>3 features running in parallel</span>
                  <span className="animate-pulse">▊</span>
                </div>
              </div>
            </div>

            {/* Waitlist form */}
            <form className="flex gap-3 max-w-md">
              <Input
                type="email"
                placeholder="you@example.com"
                className="font-mono bg-card border-border"
              />
              <Button className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                Join Waitlist
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Trinity?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not just another AI coding tool. An autonomous system that manages,
              tracks, and executes entire development workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Parallel Features"
              description="Run multiple features simultaneously. Each gets its own workspace, branch, and AI agent."
            />
            <FeatureCard
              icon={<Terminal className="w-6 h-6" />}
              title="Smart Orchestration"
              description="Trinity talks to you, understands your project, and orchestrates Claude Code with the right prompts."
            />
            <FeatureCard
              icon={<GitBranch className="w-6 h-6" />}
              title="Dependency Aware"
              description="Phase → Epic → Story hierarchy with universal dependencies. Nothing runs before it's ready."
            />
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Crash Recovery"
              description="Agent tracking and automatic recovery. If something fails, Trinity picks up where it left off."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Hotfix Fast Lane"
              description="Quick fixes without PRD ceremony. Describe the bug, Trinity finds and fixes it."
            />
            <FeatureCard
              icon={<GitMerge className="w-6 h-6" />}
              title="Auto PR & Merge"
              description="Features complete → PR to dev → optional auto-merge. You review when you want."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              From idea to implementation in three steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Define"
              description="Chat with Trinity about what you want to build. It generates a structured PRD with phases, epics, and stories."
              code={`$ trinity prd create\n> Add user auth with OAuth\n\nGenerating PRD...\n✓ 3 epics, 12 stories created`}
            />
            <StepCard
              number="02"
              title="Run"
              description="Trinity clones your repo, creates feature branches, and runs multiple AI agents in parallel."
              code={`$ trinity run --all\n\n[auth]     ● running\n[payments] ● running\n[notify]   ○ queued`}
            />
            <StepCard
              number="03"
              title="Review"
              description="Wake up to pull requests. Review the code, merge to dev, release when ready."
              code={`$ trinity status\n\nPRs ready for review:\n  #42 feat: user auth\n  #43 feat: payments`}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Cpu className="w-12 h-12 mx-auto mb-6 text-emerald-400" />
          <h2 className="text-3xl font-bold mb-4">Ready to build on autopilot?</h2>
          <p className="text-muted-foreground mb-8">
            Join the waitlist for early access. Be the first to know when Trinity launches.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              className="font-mono bg-card border-border"
            />
            <Button className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
              Join Waitlist
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded" />
            <span className="font-mono">Trinity AI Labs</span>
          </div>
          <div>© 2025 Trinity AI Labs</div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 bg-card border-border hover:border-emerald-500/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

function StepCard({ number, title, description, code }: {
  number: string;
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div>
      <div className="text-5xl font-bold text-emerald-500/20 mb-4 font-mono">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="rounded-lg border border-border bg-card p-4 font-mono text-xs">
        <pre className="text-muted-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}
