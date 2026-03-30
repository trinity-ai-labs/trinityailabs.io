# Working with Stories

Stories are the fundamental units of work in Trinity. Each story represents a specific piece of functionality that an AI agent can implement independently.

## Story List

Navigate to **Stories** in the sidebar to see all stories across your PRDs.

### Filtering

Filter stories by:

- **Status** — pending, running, complete, failed, skipped
- **PRD** — which plan they belong to
- **Phase** — which development phase
- **Epic** — which epic grouping
- **Difficulty** — rating from 1-5
- **Type** — regular story, checkpoint, or quality checkpoint

### Sorting

Sort by:

- Story ID (default order from the plan)
- Difficulty
- Status
- Surface area

## Story Detail View

Click any story to see its full details:

### Description

The story description explains what needs to be built. It should be specific enough for an agent to implement without ambiguity.

### Acceptance Criteria

A checklist of conditions that must be met for the story to be considered complete. Agents use these to verify their work.

### Metadata

- **Story ID** — unique identifier (e.g., 1.2.3 for PRD 1, Phase 2, Story 3)
- **Difficulty** — 1 (trivial) to 5 (very complex)
- **Surface area** — small, medium, or large (how much code is affected)
- **Story type** — `standard` or `quality_checkpoint`
- **Dependencies** — other stories that must complete first
- **Tags** — custom labels (including `repo:name` tags for multi-repo projects)

### Pipeline Status

When a story is running, you can see:

- Which agent phase it's in (Analyst, Implementer, Auditor, Documenter)
- Progress within the current phase
- Any gate that's been triggered

### Agent Handoffs

Reports from each agent in the pipeline:

- **Analyst report** — implementation plan, detected services, potential issues
- **Implementer report** — what was built, decisions made
- **Auditor report** — review findings, simplification passes, code quality
- **Documenter report** — what was committed, vault entries created

### PR and Merge Status

For completed stories:

- Pull request link and status
- Merge status per repository
- Branch names used

## Story Lifecycle

### Pending

The story is waiting to run. It either has unmet dependencies or hasn't been picked up by a worker yet.

### Running

A worker has claimed the story and is executing it through the agent pipeline. You can see which phase it's in.

### Complete

All agents have finished successfully. The code is committed, a PR may be open, and documentation has been written to the vault.

### Failed

Something went wrong during execution. Check the agent handoffs for details about what failed and why.

### Skipped

The story was manually skipped by a user. It won't be executed and doesn't block downstream stories.

## Story Types

### Regular Stories

Standard development work — features, bug fixes, refactors. These flow through the full 4-phase agent pipeline.

### Checkpoint Stories

Release gates that trigger a comprehensive review:

- Codebase analysis
- Multi-perspective audit
- Issue fixing loop
- Release notes and versioning (for release checkpoints)
- Human approval gate

Checkpoint stories can be placed anywhere in the dependency graph — they're not limited to phase boundaries.

### Quality Checkpoint Stories

Similar to checkpoints but focused on code quality without release tagging. They run the audit/fix loop but skip versioning and release notes.

## Editing Stories

You can edit stories that haven't started execution:

- Click the story to open the detail view
- Edit fields directly
- Changes save automatically

Protected stories (running, completed, merged) can't be edited to prevent disrupting in-progress or finished work.

## Automation Overrides

Each story has an **Automation** tab where you can override automation and model settings for that specific story. These overrides sit between project-level and job-level settings in the cascade:

**Global → Team → Project → Entity → Job**

Available overrides:

- **Auto-create PR** — automatically create a pull request after implementation
- **Auto-merge** — merge the PR without manual approval
- **Squash merge** — squash commits when merging
- **Delete branch after merge** — clean up the feature branch
- **Auto-approve quality checkpoints** — skip the human approval gate for quality checkpoints
- **Model overrides** — use different AI models for this story (reasoning, standard, fast, micro tiers)

Leave any toggle unset to inherit from the project (or team/global) default. Overrides only apply to the specific story — they don't affect other stories in the same PRD.

## Multi-Repo Stories

In multi-repo projects, stories may touch multiple repositories. Each repo tracks its own state:

- Separate branches per repo
- Independent PR and merge status
- Per-repo tags on checkpoint stories control which repos are included
