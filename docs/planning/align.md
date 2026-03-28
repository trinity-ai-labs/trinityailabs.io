# Align

Align checks your project's health and adapts to your project's phase:

- **Pre-PRD** — evaluates your roadmap for consistency, completeness, and clarity before generating your first PRD
- **Post-PRD** — performs a health check on your project, identifying drift, gaps, scope issues, and areas for improvement

Trinity automatically selects the right mode based on whether your project has a PRD yet.

## Align Mode (Pre-PRD)

Available before you've generated your first PRD. Click **Align** in the sidebar.

### How It Works

Align scans your roadmap sections and evaluates them for:

- Consistency between phases and goals
- Completeness of scope and requirements
- Clarity of descriptions and acceptance criteria
- Feasibility for a first release

### Acting on Findings

Select findings and click **Refine Roadmap** to go back to your onboarding roadmap with the selected issues highlighted, so you can address them before generating a PRD.

## Align Mode (Post-PRD)

Available after your first PRD is generated. Click **Align** in the sidebar.

You can run alignment in two ways:

### Zero-Input Mode

Trinity scans the entire project without any specific concern. It examines:

- PRD structure and story health
- Drift between roadmap intent and current execution state
- Scope gaps or overlaps
- Dependency issues and blocking patterns

### Specific Concern Mode

Type a specific concern into the chat (e.g., "The API stories seem disconnected from the auth phase" or "We're behind on the core features"). Trinity focuses its analysis on that area while still checking for related issues.

## Understanding Results

Both modes return structured findings:

### Health Score

An overall score (0-100) representing project health. This is a quick reference — the real value is in the individual findings.

### Findings

Each finding includes:

- **Title** — what was found
- **Severity** — how important it is to address
- **Category** — what area it relates to (architecture, security, performance, etc.)
- **Description** — detailed explanation of the issue
- **Recommendation** — suggested approach to fix it

### Summary

A high-level narrative summarizing the project's state and the most important actions to take.

## Acting on Findings

Select findings and click **Implement** to generate stories that address the issues. The finding context is passed to the Architect flow, so generated stories are specifically targeted at the problem.

You can also use findings for manual review — they're especially useful for prioritizing technical debt, identifying security issues, and understanding areas that need attention.

## Chat Follow-Up

After the initial analysis, you can ask follow-up questions in the chat:

- "Tell me more about the authentication finding"
- "What's the impact of not fixing the deprecated dependency?"
- "How would you prioritize these findings?"

The chat maintains context from the analysis, so follow-ups are informed by the full scan results.

## When to Use Align

**Pre-PRD** — run before generating your first PRD to catch roadmap issues early. Cheaper to fix scope problems before stories are created.

**Post-PRD** — good times to run:

- **Before a new PRD** — understand the current state before planning new work
- **After a checkpoint** — verify the release is healthy
- **Periodically** — catch issues before they compound
- **When something feels off** — if execution isn't progressing as expected, run a specific-concern check

## Align vs. Audit vs. Auditor

These three features serve different purposes:

- **Align** — project-wide roadmap and execution health check, accessible from the sidebar
- **Audit** — on-demand codebase quality scanner accessible from the sidebar, analyzes source code for gaps, risks, and improvements (see the [Codebase Audit Tracking](/knowledge?book=user-guide&section=insights&chapter=audit-tracking&page=audit-tracking) page)
- **Auditor** — per-story code review agent that runs automatically during the execution pipeline

They complement each other: Align catches planning and scope issues, Audit catches codebase-level quality gaps, and the Auditor catches story-level problems during execution.
