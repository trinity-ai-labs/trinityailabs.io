# Releases

Releases group one or more PRDs into a shippable unit. They provide the execution scope — all stories in linked PRDs execute together under one coordinator. When all stories are merged, the release executes directly as its own job to run the checkpoint pipeline (audit, release notes, tagging).

## Creating a Release

1. Click **Releases** in the sidebar
2. Click **Create Release**
3. Fill in:
   - **Name** — a label for this release (e.g., "MVP", "Beta 2")
   - **Version** — the semver version (e.g., "v1.0", "v0.2")
   - **Description** — optional summary of what's included
   - **PRDs** — optionally link PRDs at creation time
4. Click **Create**

## Release Lifecycle

Releases progress through four statuses:

| Status | Meaning |
|--------|---------|
| **Created** | Work in progress — stories are being built |
| **Ready** | All stories complete, ready for release process |
| **Releasing** | Release checkpoint running (audit, notes, tagging) |
| **Released** | Done — repos tagged, release notes published |

Transition between statuses using the buttons in the release detail panel.

## Linking PRDs

Each release must have at least one linked PRD. PRDs provide the stories that make up the release.

- Open a release and use the **PRD Linker** to add or remove PRDs
- Each PRD can only belong to one active release at a time
- When you link a PRD whose stories depend on stories in another release's PRDs, Trinity automatically adds a release dependency

## Release Dependencies

Releases can depend on other releases. This creates a DAG (directed acyclic graph) that enforces ordering:

- A release cannot transition to **Releasing** until all its dependencies are **Released**
- Dependencies are auto-inferred from cross-PRD story dependencies when linking PRDs
- You can also add or remove dependencies manually via the **Dependency Editor**
- Circular dependencies are detected and blocked

## Running a Release

Execution is release-scoped. To start:

1. Go to the **Run** page
2. Select the release to execute
3. Click **Start** and configure workers, mode, etc.

Each release gets its own coordinator, worker pool, and job queue. You can run multiple releases in parallel — the **Multi-Release Status** bar shows pills for each running release with progress counts.

Your release selection is saved per-device so it persists between sessions.

## Release Detail Panel

Click any release card to open its detail panel:

- **Status badge and transition buttons** — advance through the lifecycle
- **Story progress** — bar showing merged/released count vs. total
- **PRD Linker** — add or remove linked PRDs
- **Dependency Editor** — manage release dependencies
- **Delete** — soft-deletes the release (disabled for released releases or those with active jobs)

When stories in linked PRDs have active execution jobs, editing is locked to prevent conflicts.

### Automation Tab

Releases also have an **Automation** tab for per-release overrides. In addition to the standard automation settings (auto-PR, auto-merge, squash merge, etc.), releases support:

- **Auto-release to base** — automatically merge to the base branch after release
- **Delete release branch** — clean up the release branch after completion

These overrides follow the same cascade as stories: Global → Team → Project → Entity → Job.

## Releases Page Layout

The Releases page organizes releases into columns by status:

- **In Progress** — `created` releases
- **Ready to Release** — `ready` releases
- **Releasing** — `releasing` releases
- **Released** — `released` releases (historical)

## Deleting a Release

You can delete a release if:

- It is **not** in `released` status (released releases are historical records)
- No other active releases depend on it
- It has no active execution jobs

Deletion is a soft delete — the record is preserved for audit purposes but hidden from the UI.
