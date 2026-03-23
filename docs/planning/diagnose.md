# Align & Diagnose

This feature adapts to your project's phase, offering two modes:

- **Align** (pre-PRD) — evaluates your roadmap for consistency, completeness, and clarity before generating your first PRD
- **Diagnose** (post-PRD) — performs a health check on your project, identifying issues, risks, and areas for improvement

Trinity automatically selects the right mode based on whether your project has a PRD yet.

## Align Mode (Pre-PRD)

Available before you've generated your first PRD. Navigate to **Plan** and click **Align**.

### How It Works

Align scans your roadmap sections and evaluates them for:

- Consistency between phases and goals
- Completeness of scope and requirements
- Clarity of descriptions and acceptance criteria
- Feasibility for a first release

### Acting on Findings

Select findings and click **Refine Roadmap** to go back to your onboarding roadmap with the selected issues highlighted, so you can address them before generating a PRD.

## Diagnose Mode (Post-PRD)

Available after your first PRD is generated. Navigate to **Plan** and click **Diagnose**.

You can run a diagnosis in two ways:

### Zero-Input Mode

Trinity scans the entire project without any specific concern. It examines:

- Code quality and consistency
- Architecture health
- Dependency freshness
- Test coverage
- Security posture
- Performance patterns

### Specific Concern Mode

Type a specific concern into the chat (e.g., "The API response times have been slow" or "We're seeing memory leaks in production"). Trinity focuses its analysis on that area while still checking for related issues.

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

## Acting on Diagnose Findings

Select findings and click **Implement** to generate stories that address the issues. The finding context is passed to the Architect flow, so generated stories are specifically targeted at the problem.

You can also use findings for manual review — they're especially useful for prioritizing technical debt, identifying security issues, and understanding areas that need attention.

## Chat Follow-Up

After the initial analysis, you can ask follow-up questions in the chat:

- "Tell me more about the authentication finding"
- "What's the impact of not fixing the deprecated dependency?"
- "How would you prioritize these findings?"

The chat maintains context from the analysis, so follow-ups are informed by the full scan results.

## When to Use Each Mode

**Align** — run before generating your first PRD to catch roadmap issues early. Cheaper to fix scope problems before stories are created.

**Diagnose** — good times to run:

- **Before a new PRD** — understand the current state before planning new work
- **After a checkpoint** — verify the release is healthy
- **Periodically** — catch issues before they compound
- **When something feels off** — if performance degrades or bugs increase, run a specific-concern diagnosis

## Diagnose vs. Auditor

The Diagnose feature is different from the Auditor agent in the story pipeline:

- **Diagnose** — project-wide health check you run manually
- **Auditor** — per-story code review that runs automatically during execution

They complement each other: Diagnose catches systemic issues, while the Auditor catches story-level problems.
