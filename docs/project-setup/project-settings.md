# Project Settings

Project settings let you configure how Trinity manages your project's git workflow, repository structure, and business details.

## Accessing Settings

Navigate to **Settings** in the sidebar, then select the project settings tab.

## General

- **Project name** — display name used throughout the UI
- **Description** — brief summary of the project
- **Git path** — path to the project's git repository on disk

## Repositories

Projects can contain one or more git repositories. Each repo is configured independently:

- **Name** — identifier for the repo (e.g., "web", "api", "mobile")
- **Path** — relative path from the workspace root
- **Enabled** — toggle to include/exclude from execution

For monorepos, you'll typically have one repo entry pointing to the root. For polyrepos, each repository gets its own entry.

### Per-Repo Branch Configuration

Each repo can have its own branching rules:

- **Story branch template** — pattern for naming story branches (e.g., `feature/{story_slug}`)
- **Base branch** — the branch stories merge into (e.g., `main`, `develop`)
- **PR target** — where pull requests are opened against

Template variables available:
- `{prefix}` — configurable prefix
- `{prd}` — PRD number
- `{phase}` — phase slug
- `{epic}` — epic slug
- `{story}` — story ID
- `{slug}` — story slug
- `{story_slug}` — full story slug
- `{phase_slug}`, `{epic_slug}`, `{prd_slug}` — hierarchical slugs

### Per-Repo Merge Configuration

- **Merge strategy** — how branches are merged (merge commit, squash, rebase)
- **Delete branch after merge** — automatically clean up merged branches
- **Auto-merge** — merge PRs automatically when checks pass

## Branching Configuration

Project-level branching defaults that individual repos can override:

- **Default story template** — branch naming pattern applied to all repos unless overridden
- **Default base branch** — the integration branch

### Release Branches

Optional feature for projects that need release isolation:

- **Use release branches** — when enabled, checkpoint stories create release branches instead of merging directly
- **Release template** — naming pattern for release branches
- **Auto-release to base** — automatically merge release branches to the base branch on approval
- **Delete release branch** — clean up release branches after merging

## Business Details

Business information used by execution gates and story content:

- **Company name**
- **Contact email**
- **Phone number**
- **Address**
- **Tagline**
- **Social media links**

These are initially extracted from onboarding conversation but can be edited here at any time. Stories that need company branding or contact information will check these fields — if they're missing, an execution gate pauses the pipeline.

### Skip Checks

- **Skip asset check** — bypass the missing assets gate (useful for text-only projects)
- **Skip business details check** — bypass the missing business details gate
- **Auto-approve quality checkpoints** — quality checkpoints run full QA but skip human approval; only release checkpoints pause

## Workers

Configure parallel execution capacity:

- **Max workers** — how many stories can execute simultaneously
- **Worker timeout** — how long a worker can run before being considered stale

## Targets

View and manage project target platforms. Targets are set during onboarding but can be adjusted here:

- Each target has a **type** (Web App, Mobile, Desktop, CLI, API, Website) and a **label**
- Multiple targets can share the same type with different labels (e.g., two Mobile targets: "Client App" and "Driver App")

## Secrets

Manage encrypted API keys and credentials:

- View configured secrets (values are masked)
- Add new secrets
- Update or delete existing secrets
- Import from `.env` files

Secrets are injected as environment variables when agents execute stories. They're encrypted at rest using AES-256-GCM.
