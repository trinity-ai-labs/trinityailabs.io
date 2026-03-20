# Creating Your First Project

This guide walks you through creating a new project in Trinity, from initial setup to your first running story.

## Step 1: Create a Project

From the main screen, click **New Project**. You'll need to provide:

- **Name** — a human-readable name for your project (e.g., "My Todo App")
- **Git repository path** — the local path to your project's git repository

If you're starting from scratch (no existing code), Trinity will guide you through the full onboarding wizard. If you have an existing codebase, you can use the **Import Existing** flow instead.

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

## Step 5: Start Execution

Navigate to the **Run** page and click **Start**. This launches the coordinator, which:

1. Identifies stories that are ready to run (all dependencies met)
2. Assigns them to available workers
3. Each worker executes the story through the agent pipeline

You can configure the number of parallel workers in project settings.

## Step 6: Monitor Progress

While execution runs, you can:

- **Watch the Run page** — see which stories are in progress, completed, or queued
- **Check gates** — approve or provide input when agents pause for your decision
- **Browse the Knowledge Base** — agents write learnings as they work
- **View Recaps** — daily summaries of what was accomplished

## Step 7: Iterate

After your first PRD completes:

- **Add features** with the Add Feature flow — describe what you want and Trinity generates new stories
- **Create a new PRD** for the next development iteration
- **Run Diagnose** to check project health and find areas for improvement
- **Check Metrics** to understand execution efficiency

## Tips for Success

- **Be specific during onboarding** — the more detail you provide about what you're building, the better the generated plans will be
- **Review plans before execution** — catching issues in planning is much cheaper than during execution
- **Address gates promptly** — the pipeline pauses at gates, so responding quickly keeps things moving
- **Check the Knowledge Base** — agents learn as they work, and their discoveries can inform your decisions
- **Start with a small scope** — it's easier to add features iteratively than to plan everything upfront
