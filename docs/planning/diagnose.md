# Project Diagnosis

The Diagnose feature performs a health check on your project, identifying issues, risks, and areas for improvement.

## Running a Diagnosis

1. Navigate to **Plan**
2. Click **Diagnose**

You can run a diagnosis in two modes:

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

Diagnose returns structured findings:

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

Findings aren't just informational — you can act on them directly:

### Send to Add Feature

Click **Send to Add Feature** on any finding to generate stories that address the issue. The finding context is passed to the Add Feature flow, so generated stories are specifically targeted at the problem.

### Manual Review

Use findings as input for your own planning. They're especially useful for:

- Prioritizing technical debt
- Identifying security issues before they become problems
- Understanding areas where the codebase needs attention

## Chat Follow-Up

After the initial diagnosis, you can ask follow-up questions in the chat:

- "Tell me more about the authentication finding"
- "What's the impact of not fixing the deprecated dependency?"
- "How would you prioritize these findings?"

The chat maintains context from the diagnosis, so follow-ups are informed by the full scan results.

## When to Run Diagnose

Good times to run a diagnosis:

- **Before a new PRD** — understand the current state before planning new work
- **After a checkpoint** — verify the release is healthy
- **Periodically** — catch issues before they compound
- **When something feels off** — if performance degrades or bugs increase, run a specific-concern diagnosis

## Diagnose vs. Auditor

The Diagnose feature is different from the Auditor agent in the story pipeline:

- **Diagnose** — project-wide health check you run manually
- **Auditor** — per-story code review that runs automatically during execution

They complement each other: Diagnose catches systemic issues, while the Auditor catches story-level problems.
