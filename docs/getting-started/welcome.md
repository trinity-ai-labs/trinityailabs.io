# Welcome to Trinity

Trinity is a next-generation Integrated Development Environment. It coordinates multiple AI agents to build your software projects — planning, coding, review, and shipping — all in one environment, while you maintain oversight and control.

## What Trinity Does

Trinity manages the full lifecycle of software development:

1. **Plans** your project by generating structured PRDs (Product Requirement Documents) with phases, epics, and stories
2. **Executes** stories autonomously using AI agents that write, review, and test code
3. **Learns** from each execution, building a knowledge base of patterns, gotchas, and decisions
4. **Reports** on progress with recaps, metrics, and exportable PDF reports

## Core Concepts

### Projects

A project is your top-level container. It represents a software product you're building — whether it's a web app, mobile app, API, CLI tool, or a combination. Projects can target multiple platforms simultaneously (e.g., a Web App + API + Mobile app).

### PRDs (Product Requirement Documents)

PRDs are your plans. Each PRD is an iteration of your project's development plan, organized into:

- **Phases** — high-level development stages (e.g., "Foundation", "Core Features", "Polish")
- **Epics** — groups of related work within a phase
- **Stories** — individual units of work that agents execute

You can have multiple PRDs per project, each building on the previous one.

### Stories

Stories are the atomic unit of work. Each story has:

- A clear description and acceptance criteria
- Difficulty and surface area ratings
- Dependencies on other stories
- A lifecycle: pending → running → complete (or failed)

### The Agent Pipeline

When a story executes, it flows through a 4-phase agent pipeline:

1. **Analyst** — reads the codebase, plans the implementation, checks for blockers
2. **Implementer** — writes the code and tests
3. **Auditor** — reviews and simplifies the code through multiple passes
4. **Documenter** — commits the work and records learnings

### Execution Gates

Gates are checkpoints where Trinity pauses for your input. They occur when:

- An agent detects a potential issue (e.g., a technology substitution needed)
- Assets or business details are missing
- A checkpoint story requires release approval

Gates ensure you stay in control of critical decisions.

### Knowledge Base (Vault)

The vault is Trinity's memory. It stores:

- Project architecture and design decisions
- Learnings from story execution
- Gotchas and pitfalls discovered along the way
- Audit reports and analysis

Agents read from and write to the vault, creating a feedback loop where discoveries compound across executions.

## Quick Orientation

### The Sidebar

The sidebar is your main navigation. It shows:

- **Dashboard** — planning dashboard, PRD management, story graph
- **Stories** — browse all stories across PRDs
- **Run** — monitor and control execution
- **Releases** — create and manage releases that group PRDs into shippable units
- **Architect** — add features or modify stories through a conversational interface
- **Align** — run project health checks (pre-PRD roadmap review or post-PRD drift detection)
- **Audit** — scan your codebase for quality gaps, security issues, and improvements
- **Recaps** — view activity summaries and export PDF reports
- **Metrics** — execution analytics and cost tracking
- **Activity** — global activity feed with filters
- **Knowledge** — access the project knowledge base (vault)
- **Gotchas** — browse the pitfalls library (languages, frameworks, tools)
- **Teams** — manage team members and invitations
- **Settings** — configure Trinity (app-wide and per-project)

### Typical Workflow

1. **Create a project** using the onboarding wizard or by importing an existing codebase
2. **Generate a PRD** to plan your first set of features
3. **Review the plan** — adjust stories, dependencies, and priorities as needed
4. **Create a release** — group your PRD(s) into a release that scopes execution
5. **Start execution** — Trinity's coordinator assigns stories to workers within the release
6. **Monitor progress** — watch stories flow through the pipeline, approve gates as they appear
7. **Review results** — check recaps, metrics, and the knowledge base
8. **Iterate** — add features, create new PRDs and releases, and keep building

## What's Next

- **[Creating Your First Project](/knowledge?book=user-guide&section=getting-started&chapter=first-project&page=first-project)** — step-by-step guide to getting started
- **[Navigating the UI](/knowledge?book=user-guide&section=getting-started&chapter=navigating&page=navigating)** — learn the layout and navigation patterns
