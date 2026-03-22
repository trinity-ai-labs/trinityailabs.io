import Image from "next/image";
import {
  Layers,
  Brain,
  Shield,
  BarChart3,
  Container,
  GitBranch,
  Zap,
  RefreshCw,
  Terminal,
  BookOpen,
  Eye,
  Cpu,
  Users,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const showcaseFeatures = [
  {
    title: "Story cards with full context",
    description:
      "Every story shows its status, dependencies, tags, and key implementation details at a glance. Filter by phase, status, or epic.",
    image: "/screenshots/stories.png",
    alt: "Trinity Stories view — card grid showing story status, dependencies, and merged PRs",
  },
  {
    title: "Metrics that matter",
    description:
      "Track success rate, first-pass rate, cost per story, and cycle time. See your pipeline funnel, AI usage breakdown, and worker health — all from real execution data.",
    image: "/screenshots/metrics.png",
    alt: "Trinity Metrics dashboard — success rate, cost tracking, pipeline funnel visualization",
  },
  {
    title: "Project knowledge that compounds",
    description:
      "Every execution writes learnings to the Knowledge Vault. Architecture decisions, gotcha libraries, and roadmap progress — agents get smarter with every run.",
    image: "/screenshots/knowledge.png",
    alt: "Trinity Knowledge Base — project documentation with tree navigation and roadmap overview",
  },
];

const features = [
  {
    icon: Layers,
    title: "4-Phase Agent Pipeline",
    description:
      "Every story passes through Analyst → Implementer → Auditor → Documenter. Multi-agent review loops, not single-shot generation.",
    highlight: true,
  },
  {
    icon: GitBranch,
    title: "Parallel Execution",
    description:
      "Up to 5 workers running in isolated git worktrees. Each story gets its own branch, workspace, and agent. Nothing conflicts.",
  },
  {
    icon: Brain,
    title: "AI Planning Pipeline",
    description:
      "4-phase planning: Architect → Story Writer → Dependency Mapper → Calibrator. Structured PRDs with dependency graphs, not just TODO lists.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Execution Gates",
    description:
      "8 types of human checkpoints keep you in control. Approve, reject, or provide feedback at every stage. Your project, your rules.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Vault",
    description:
      "Agents learn and compound discoveries across runs. Gotcha libraries capture framework-specific pitfalls so agents don't repeat mistakes.",
  },
  {
    icon: BarChart3,
    title: "Metrics & Reports",
    description:
      "Dashboard with success rate, cost per story, cycle time. Daily/weekly/monthly recaps. PDF reports for stakeholders. Full cost tracking.",
    highlight: true,
  },
  {
    icon: Container,
    title: "Docker Integration",
    description:
      "Per-story Docker Compose stacks — Postgres, Redis, and more. Auto-detection, built-in healthchecks, dynamic port allocation. No conflicts.",
  },
  {
    icon: RefreshCw,
    title: "Crash Recovery",
    description:
      "Automatic retry and state restoration. If something fails mid-story, Trinity picks up exactly where it left off. No lost progress.",
  },
  {
    icon: Cpu,
    title: "Multi-Model Intelligence",
    description:
      "4-tier model selection: reasoning, standard, fast, and micro. 3 providers: Anthropic, DeepSeek, and Ollama for local models.",
  },
  {
    icon: Terminal,
    title: "Import Any Codebase",
    description:
      "6-step analysis pipeline understands your existing project. AI interprets your stack, structure, and patterns before writing a single line.",
  },
  {
    icon: Zap,
    title: "Auto PR & Release",
    description:
      "PRs created automatically with full documentation. Checkpoint releases with per-repo semver tagging. Optional auto-merge.",
  },
  {
    icon: Eye,
    title: "Multi-Repo Workspaces",
    description:
      "Manage multiple repositories in a single project. Stories can span repos. Coordinated branching and release management.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Create teams, invite members, and share projects. Real-time sync via Turso — everyone sees planning, execution, and results.",
  },
  {
    icon: MessageSquare,
    title: "Comments & Activity",
    description:
      "Threaded discussions on stories and PRDs. Activity feed tracks who changed what. Change history for audit trails.",
  },
];

const comingSoon = [
  {
    title: "Cloud Execution",
    description: "Managed VMs — no local machine needed",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to ship autonomously
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Not just another AI coding tool. A full development orchestrator that plans,
            executes, reviews, and learns.
          </p>
        </div>

        {/* Feature showcase with screenshots */}
        <div className="space-y-16 mb-20">
          {showcaseFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 md:gap-12`}
            >
              <div className="flex-1 space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-border overflow-hidden shadow-lg">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={720}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main features — bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-xl border p-6 transition-colors ${
                feature.highlight
                  ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                  : "border-border bg-card/50 hover:border-emerald-500/30"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Coming soon — hidden until we decide what goes here */}
        {/* <div className="mt-12">
          <h3 className="text-center text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">
            Coming Soon
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {comingSoon.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-dashed border-border bg-card/30 p-5 text-center"
              >
                <Badge variant="outline" className="mb-3 font-mono text-xs">
                  Coming Soon
                </Badge>
                <h4 className="font-semibold mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
