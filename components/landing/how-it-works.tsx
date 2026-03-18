import { MessageSquare, GitBranch, Play, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe",
    description:
      "Chat with Trinity about what you want to build. A 9-step wizard understands your project deeply — or import an existing codebase for AI analysis.",
    code: `New PRD → "Build a SaaS billing\nsystem with Stripe, usage\ntracking, and team subs"\n\n✓ Analyzing requirements...\n✓ 4 phases, 8 epics, 24 stories`,
  },
  {
    icon: GitBranch,
    title: "Plan",
    description:
      "A 4-phase AI pipeline breaks your idea into structured stories with dependency graphs: Architect → Story Writer → Dependency Mapper → Calibrator.",
    code: `Phase 1: Core Infrastructure\n  Epic 1.1: Auth System\n    → Story 1.1.1: User model\n    → Story 1.1.2: JWT auth\n  Epic 1.2: Billing\n    → Story 1.2.1: Stripe setup\n    ↳ depends on 1.1.2`,
  },
  {
    icon: Play,
    title: "Execute",
    description:
      "Up to 5 workers execute stories in parallel through a 4-agent pipeline: Analyst → Implementer → Auditor → Documenter. Each in its own git worktree.",
    code: `Workers: 3/5 active\n\n[W1] Story 1.1.2 → Auditor ●\n[W2] Story 1.2.1 → Impl    ●\n[W3] Story 1.1.3 → Analyst ●\n[W4] idle\n[W5] idle`,
  },
  {
    icon: Rocket,
    title: "Ship",
    description:
      "PRs are created automatically with full documentation. Checkpoint releases with semver tagging. Optional auto-merge. You review when you want.",
    code: `PRs ready for review:\n  #42 feat(auth): JWT auth  ✓\n  #43 feat(billing): Stripe ✓\n\nRelease v0.2.0 tagged\n  3 stories shipped\n  0 issues found`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From idea to shipped PRs in four steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group rounded-xl border border-border bg-card/50 p-6 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-400">Step {i + 1}</span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {step.description}
              </p>
              <div className="rounded-lg border border-border bg-background/50 p-4 font-mono text-xs">
                <pre className="text-muted-foreground whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
