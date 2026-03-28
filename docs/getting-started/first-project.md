# Creating Your First Project

This guide walks you through creating a new project in Trinity, from initial setup to your first running story.

## Before You Start

Make sure you have the required tools installed:

- **Git** — with your name and email configured
- **GitHub CLI** — installed and authenticated (`gh auth login`)
- **Claude Code CLI** — installed for when you're ready to run stories
- **Node.js 18+**

See the **[Prerequisites & Tool Setup](/knowledge?book=user-guide&section=getting-started&chapter=prerequisites&page=prerequisites)** page for detailed install instructions for macOS and Linux. Trinity will also check for these tools at each step and tell you exactly what to run if something is missing.

## Step 1: Create a Project

From the main screen, click **New Project**. You'll need to provide:

- **Name** — this becomes the folder name and GitHub repo name (e.g., "my-todo-app")
- **Location** — the parent directory where the project folder will be created
- **Visibility** — whether the GitHub repo is public or private

Trinity will check that Git and GitHub CLI are ready before showing the form. If something is missing, you'll see instructions to fix it with a **Check Again** button.

If you have an existing codebase, use the **Import Existing** flow instead — it validates that your folder is a git repo with a GitHub remote.

## Step 2: Onboarding Wizard

The onboarding wizard is a 9-step process that helps Trinity understand what you're building. It's conversational — Trinity asks questions and refines its understanding based on your answers.

### The Steps

1. **Explore** — describe what you want to build in natural language
2. **Clarify** — answer targeted questions about your tech stack and requirements
3. **Phasing** — define build order (if you have multiple targets)
4. **Design** — answer visual style questions and review suggested tools/frameworks
5. **Structure** — choose your project structure (monorepo, polyrepo, or single repo)
6. **Review** — approve each section of the generated roadmap
7. **Ready** — readiness check and service discovery
8. **Setup** — configure API keys for detected services
9. **Skills** — configure Claude Code skills for your project

Don't worry about getting everything perfect — you can always adjust settings later.

## Step 3: Generate Your First PRD

After onboarding, you'll land on the planning dashboard. Click **Generate PRD** to create your first plan.

The planning pipeline runs in 4 phases:

1. **Architect** — designs the phase and epic structure
2. **Story Writer** — writes individual stories with acceptance criteria
3. **Dependency Mapper** — sets up story dependencies and checkpoints
4. **Calibrator** — calibrates difficulty and surface area ratings

This process takes a few minutes. You can watch the progress in the sidebar task indicator.

## Step 4: Review Your Plan

Once the PRD is generated, review it on the planning dashboard:

- **Phase view** — see the high-level structure
- **Story graph** — visualize dependencies between stories
- **Story list** — browse individual stories, edit descriptions, adjust dependencies

Make sure the plan makes sense before starting execution. You can:

- Edit story descriptions and acceptance criteria
- Adjust difficulty ratings
- Add or remove dependencies
- Skip stories you don't want executed

## Step 5: Create a Release

Before you can start execution, you need to create a release. Releases group one or more PRDs into a shippable unit and scope the execution — each release gets its own coordinator and worker pool.

1. Navigate to **Releases** in the sidebar
2. Click **Create Release**
3. Give it a name (e.g., "MVP") and optionally a version (e.g., "v0.1")
4. Link your PRD — this auto-creates a release checkpoint story that gates the final release

You can always add more PRDs to a release later, or create additional releases for parallel work.

## Step 6: Start Execution

Navigate to the **Run** page, select your release, and click **Start**. Trinity will check that **Claude Code CLI** is installed — if it's missing, you'll see install instructions right in the modal. See the [Prerequisites](/knowledge?book=user-guide&section=getting-started&chapter=prerequisites&page=prerequisites) page for the full Claude Code setup walkthrough.

Once started, the coordinator:

1. Identifies stories that are ready to run (all dependencies met)
2. Assigns them to available workers
3. Each worker executes the story through the agent pipeline (Analyst → Implementer → Auditor → Documenter)

You can configure the number of parallel workers and automation settings in the run modal.

## Step 7: Monitor Progress

While execution runs, you can:

- **Watch the Run page** — see which stories are in progress, completed, or queued
- **Check gates** — approve or provide input when agents pause for your decision
- **Browse the Knowledge Base** — agents write learnings as they work
- **View Recaps** — daily summaries of what was accomplished

## Step 8: Iterate

After your first release ships:

- **Add features** with the Architect flow — describe what you want and Trinity generates new stories
- **Create a new PRD** for the next development iteration
- **Create a new release** to scope the next batch of work
- **Run Align** to check project health and find areas for improvement
- **Run Audit** to scan your codebase for quality gaps and security risks
- **Check Metrics** to understand execution efficiency

## Tips for Success

- **Be specific during onboarding** — the more detail you provide about what you're building, the better the generated plans will be
- **Review plans before execution** — catching issues in planning is much cheaper than during execution
- **Address gates promptly** — the pipeline pauses at gates, so responding quickly keeps things moving
- **Check the Knowledge Base** — agents learn as they work, and their discoveries can inform your decisions
- **Start with a small scope** — it's easier to add features iteratively than to plan everything upfront
