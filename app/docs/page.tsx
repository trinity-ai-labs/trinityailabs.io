import Link from "next/link";
import { DOC_SECTIONS } from "@/lib/docs-structure";
import {
  Rocket,
  Settings,
  BarChart3,
  Brain,
  Play,
  Wrench,
  ArrowRight,
} from "lucide-react";

const SECTION_ICONS: Record<string, React.ElementType> = {
  "getting-started": Rocket,
  "project-setup": Settings,
  planning: Brain,
  execution: Play,
  insights: BarChart3,
  configuration: Wrench,
};

const CHAPTER_DESCRIPTIONS: Record<string, string> = {
  welcome:
    "Core concepts — Projects, PRDs, Stories, the Agent Pipeline, and Knowledge Base.",
  "first-project": "Step-by-step guide from launch to your first shipped PR.",
  navigating:
    "UI layout, sidebar navigation, project switcher, and keyboard shortcuts.",
  "onboarding-wizard":
    "9-step wizard: Explore, Clarify, Phasing, Design, Structure, Review, Ready, Setup, Skills.",
  "import-existing":
    "6-step import flow: Scan, Review, Secrets, Docs, Skills, Save.",
  "project-settings":
    "Branching, merge strategy, execution gates, Docker, and per-repo overrides.",
  "project-assets":
    "Upload wireframes, specs, and brand guides with AI-generated descriptions.",
  dashboard:
    "PRD management, progress tracking, phase overview, and blocked story visibility.",
  "prd-planning":
    "4-phase AI pipeline: Architect, Story Writer, Dependency Mapper, Calibrator.",
  "add-feature":
    "Describe features in natural language. Trinity generates structured stories.",
  align:
    "Phase-adaptive project health checks — roadmap quality pre-PRD, execution health post-PRD.",
  graph: "Visual dependency graph with layout management and cross-PRD views.",
  stories:
    "Story structure, status lifecycle, acceptance criteria, tags, and linking.",
  running:
    "Workers, the 4-agent pipeline, git worktrees, monitoring, and retries.",
  gates:
    "8 human checkpoints: deviation approval, missing assets, blocked stories, and more.",
  checkpoints: "Quality and release checkpoints with per-repo semver tagging.",
  "knowledge-base":
    "Project vault with books, chapters, and pages. Agents write learnings after every run.",
  gotchas:
    "Framework-specific pitfall libraries consulted by agents to avoid known issues.",
  "recaps-reports":
    "Daily, weekly, monthly summaries with PDF export for stakeholders.",
  metrics:
    "Success rate, cost per story, cycle time, pipeline funnel, and worker health.",
  "audit-tracking":
    "Link stories to audit findings. Auto-check addressed items after merge.",
  "app-settings":
    "API keys, default behaviors, execution preferences, and theme selection.",
  "ai-models":
    "4-tier model system across Anthropic, DeepSeek, and Ollama providers.",
};

export default function DocsIndex() {
  const firstPage = DOC_SECTIONS[0].chapters[0];

  return (
    <div className="max-w-[46rem] mx-auto px-6 sm:px-10 py-12">
      {/* Hero */}
      <div className="mb-14">
        <h1 className="text-[2rem] font-bold tracking-tight mb-3">
          Documentation
        </h1>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 mb-5" />
        <p className="text-[1.05rem] text-muted-foreground leading-relaxed max-w-xl">
          Everything you need to know about Trinity — from your first project to
          advanced configuration.
        </p>
        <Link
          href={`/docs/${DOC_SECTIONS[0].slug}/${firstPage.slug}`}
          className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
        >
          Get started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {DOC_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section.slug];
          return (
            <section key={section.slug}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                </div>
                <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground/80">
                  {section.name}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.chapters.map((chapter) => (
                  <Link
                    key={chapter.slug}
                    href={`/docs/${section.slug}/${chapter.slug}`}
                    className="group relative rounded-xl border border-border p-5 hover:border-emerald-500/25 hover:bg-emerald-500/[3%] transition-all"
                  >
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {CHAPTER_DESCRIPTIONS[chapter.slug] ?? ""}
                    </p>
                    <ArrowRight className="absolute top-5 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-400/60 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
