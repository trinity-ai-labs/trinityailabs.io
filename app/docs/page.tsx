import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import {
  BookOpen,
  Rocket,
  Compass,
  Settings,
  BarChart3,
  Layers,
  Play,
  Shield,
  Brain,
  Wrench,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | Trinity AI Labs",
  description:
    "Learn how to use Trinity — from project setup and planning to execution, insights, and configuration.",
};

const sections = [
  {
    title: "Getting Started",
    icon: Rocket,
    chapters: [
      {
        title: "Welcome",
        description:
          "What Trinity is, core concepts (Projects, PRDs, Stories, Agent Pipeline, Knowledge Base), and how it all fits together.",
      },
      {
        title: "First Project",
        description:
          "Step-by-step guide to creating your first project — from launch to your first shipped PR.",
      },
      {
        title: "Navigating",
        description:
          "UI layout, sidebar navigation, project switcher, and keyboard shortcuts.",
      },
    ],
  },
  {
    title: "Project Setup",
    icon: Settings,
    chapters: [
      {
        title: "Onboarding Wizard",
        description:
          "9-step wizard for new projects: Explore, Clarify, Phasing, Design, Structure, Review, Ready, Setup, Skills.",
      },
      {
        title: "Import Existing",
        description:
          "6-step wizard for importing existing codebases: Scan, Review, Secrets, Docs, Skills, Save.",
      },
      {
        title: "Project Settings",
        description:
          "Configure branching, merge strategy, execution gates, Docker services, and per-repo overrides.",
      },
      {
        title: "Project Assets",
        description:
          "Upload wireframes, specs, and brand guides. AI-generated descriptions and folder hierarchy.",
      },
    ],
  },
  {
    title: "Planning",
    icon: Brain,
    chapters: [
      {
        title: "Dashboard",
        description:
          "PRD management, progress tracking, phase overview, and blocked story visibility.",
      },
      {
        title: "PRD Planning",
        description:
          "4-phase AI pipeline: Architect → Story Writer → Dependency Mapper → Calibrator.",
      },
      {
        title: "Add Feature",
        description:
          "Describe what you want in natural language. Trinity generates structured stories with dependencies.",
      },
      {
        title: "Diagnose",
        description:
          "Zero-input health checks for existing projects. AI-powered findings with actionable fixes.",
      },
      {
        title: "Dependency Graph",
        description:
          "Visual dependency graph with layout management. See how stories connect across phases and epics.",
      },
    ],
  },
  {
    title: "Execution",
    icon: Play,
    chapters: [
      {
        title: "Running Stories",
        description:
          "Start execution, manage workers, monitor the 4-agent pipeline (Analyst → Implementer → Auditor → Documenter).",
      },
      {
        title: "Stories",
        description:
          "Story structure, status lifecycle, acceptance criteria, tags, and audit source linking.",
      },
      {
        title: "Execution Gates",
        description:
          "8 types of human checkpoints: deviation approval, missing assets, blocked stories, and more.",
      },
      {
        title: "Checkpoints & Releases",
        description:
          "Quality checkpoints, release checkpoints with per-repo semver tagging, and gate approval flow.",
      },
    ],
  },
  {
    title: "Insights",
    icon: BarChart3,
    chapters: [
      {
        title: "Knowledge Base",
        description:
          "Project vault with books, chapters, and pages. Agents write learnings after every execution.",
      },
      {
        title: "Gotchas",
        description:
          "Framework-specific pitfall libraries. Agents consult these to avoid repeating known issues.",
      },
      {
        title: "Recaps & Reports",
        description:
          "Daily, weekly, monthly summaries. PDF export for executive and technical audiences.",
      },
      {
        title: "Metrics",
        description:
          "Success rate, first-pass rate, cost per story, cycle time, pipeline funnel, and worker health.",
      },
      {
        title: "Audit Tracking",
        description:
          "Link stories to codebase audit findings. Auto-check addressed items after merge.",
      },
    ],
  },
  {
    title: "Configuration",
    icon: Wrench,
    chapters: [
      {
        title: "App Settings",
        description:
          "Global settings: API keys, default behaviors, execution preferences, and theme selection.",
      },
      {
        title: "AI Models",
        description:
          "4-tier model system (reasoning, standard, fast, micro) with 3 providers: Anthropic, DeepSeek, Ollama.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl md:text-4xl font-bold">Documentation</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to know about Trinity — from your first project to
              advanced configuration. The full user guide is built into the app under
              Knowledge Base.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {section.chapters.map((chapter) => (
                    <div
                      key={chapter.title}
                      className="rounded-xl border border-border bg-card/50 p-5 hover:border-emerald-500/30 transition-colors"
                    >
                      <h3 className="font-medium mb-2">{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-border bg-card/50 p-8 text-center">
            <Cpu className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Full docs live inside the app
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              The complete user guide is built into Trinity under the Knowledge Base section.
              Download the app to browse the full documentation with interactive examples.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
