// ---------------------------------------------------------------------------
// Types & structure — safe to import from client components
// ---------------------------------------------------------------------------

export interface DocChapter {
  slug: string;
  title: string;
  pageTitle: string;
}

export interface DocSection {
  slug: string;
  name: string;
  icon: string;
  chapters: DocChapter[];
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    slug: "getting-started",
    name: "Getting Started",
    icon: "rocket",
    chapters: [
      {
        slug: "welcome",
        title: "Welcome",
        pageTitle: "Welcome to Trinity",
      },
      {
        slug: "first-project",
        title: "First Project",
        pageTitle: "Creating Your First Project",
      },
      {
        slug: "navigating",
        title: "Navigating",
        pageTitle: "Navigating the UI",
      },
    ],
  },
  {
    slug: "project-setup",
    name: "Project Setup",
    icon: "folder-plus",
    chapters: [
      {
        slug: "onboarding-wizard",
        title: "Onboarding Wizard",
        pageTitle: "Onboarding Wizard",
      },
      {
        slug: "import-existing",
        title: "Import Existing",
        pageTitle: "Importing an Existing Project",
      },
      {
        slug: "project-settings",
        title: "Project Settings",
        pageTitle: "Project Settings",
      },
      {
        slug: "project-assets",
        title: "Project Assets",
        pageTitle: "Project Assets",
      },
    ],
  },
  {
    slug: "planning",
    name: "Planning",
    icon: "clipboard-list",
    chapters: [
      {
        slug: "dashboard",
        title: "Dashboard",
        pageTitle: "Planning Dashboard",
      },
      {
        slug: "prd-planning",
        title: "PRD Planning",
        pageTitle: "PRD Planning Pipeline",
      },
      {
        slug: "add-feature",
        title: "Add Feature",
        pageTitle: "Adding Features",
      },
      {
        slug: "diagnose",
        title: "Diagnose",
        pageTitle: "Project Diagnosis",
      },
      {
        slug: "graph",
        title: "Dependency Graph",
        pageTitle: "Dependency Graph",
      },
    ],
  },
  {
    slug: "execution",
    name: "Execution",
    icon: "play-circle",
    chapters: [
      {
        slug: "stories",
        title: "Stories",
        pageTitle: "Working with Stories",
      },
      {
        slug: "running",
        title: "Running",
        pageTitle: "Running Execution",
      },
      {
        slug: "gates",
        title: "Gates",
        pageTitle: "Execution Gates",
      },
      {
        slug: "checkpoints",
        title: "Checkpoints & Releases",
        pageTitle: "Checkpoints & Releases",
      },
    ],
  },
  {
    slug: "insights",
    name: "Knowledge & Insights",
    icon: "brain",
    chapters: [
      {
        slug: "knowledge-base",
        title: "Knowledge Base",
        pageTitle: "Knowledge Base",
      },
      {
        slug: "gotchas",
        title: "Gotchas",
        pageTitle: "Gotchas Library",
      },
      {
        slug: "recaps-reports",
        title: "Recaps & Reports",
        pageTitle: "Recaps & Reports",
      },
      {
        slug: "metrics",
        title: "Metrics",
        pageTitle: "Metrics Dashboard",
      },
      {
        slug: "audit-tracking",
        title: "Audit Tracking",
        pageTitle: "Codebase Audit Tracking",
      },
    ],
  },
  {
    slug: "configuration",
    name: "Configuration",
    icon: "sliders",
    chapters: [
      {
        slug: "app-settings",
        title: "App Settings",
        pageTitle: "App Settings",
      },
      {
        slug: "ai-models",
        title: "AI Models",
        pageTitle: "AI Model Configuration",
      },
    ],
  },
];
