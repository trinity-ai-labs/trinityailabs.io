# Teams

Teams let multiple developers collaborate on projects through a shared database. Each team gets its own Turso database that syncs across all members' machines.

## Creating a Team

1. Click the **team switcher** at the top of the sidebar (shows "Personal" by default)
2. Or go to the **Teams** page from the sidebar
3. Enter a team name and click **Create**
4. The team's database is provisioned automatically

## Switching Scopes

The team switcher in the sidebar lets you switch between:

- **Personal** — your own projects, synced across your devices
- **Team** — shared projects visible to all team members

Switching scopes changes which projects are shown. Execution continues in the background regardless of which scope you're viewing.

## Team Roles

| Role | Can do |
|------|--------|
| **Owner** | Everything — manage members, billing, secrets, delete projects, approve checkpoints, configure permissions |
| **Member** | Edit PRDs, run stories, respond to story gates, create projects (plus any actions granted by permission overrides) |

### Configurable Permissions

Some actions can be opened up to all team members via permission overrides. Team owners configure these at the team level, and can further override per-project:

| Permission | Default | Description |
|-----------|---------|-------------|
| **Approve Checkpoints** | Owner only | Who can approve release and quality checkpoint gates |
| **Manage Secrets** | Owner only | Who can create, edit, delete, or reveal secret values |
| **Delete Projects** | Owner only | Who can archive (soft-delete) projects |
| **Reclaim Jobs** | Owner only | Who can reclaim stuck execution jobs |

Set these in **Team Settings** → **Permissions**, or override per-project in **Project Settings** → **Permission Overrides**.

The cascade is: **Project → Team → Default (owner only)**. In personal scope, all permissions are open.

## Inviting Members

Only the team owner can invite:

1. Go to **Teams** page
2. Enter the person's email or handle
3. They receive an invite and can join the team

## Seat Sponsorship

Team owners can sponsor seats for users who don't have their own subscription:

1. Go to the **Teams** page
2. Under **Sponsored Seats**, enter the email or handle of the person to sponsor
3. The sponsored user gets access to Trinity on your subscription

Sponsored seats count toward your team's seat limit and storage quota.

## Team Settings

Team owners can configure team-wide defaults that sit between global (personal) settings and per-project overrides:

1. Switch to a team scope using the team switcher
2. Click **Team Settings** in the sidebar (only visible to team owners)

### What You Can Configure

| Category | Settings |
|----------|----------|
| **Automation** | Auto PR, Auto Merge, Squash Merge, Delete After Merge, Skip Asset Check, Skip Business Details Check, Auto Release to Base, Delete Release Branch, Auto-Approve Quality Checkpoints |
| **AI Models** | Default models for each tier (Reasoning, Standard, Fast, Micro) |
| **Permissions** | Approve Checkpoints, Manage Secrets, Delete Projects, Reclaim Jobs (owner-only or open to all) |

### Settings Hierarchy

Settings cascade in this order — each layer overrides the previous:

1. **Global** (personal app settings) — baseline defaults
2. **Team** (team settings) — team-wide overrides
3. **Project** (project settings) — per-project overrides
4. **Job** (run-level) — one-time overrides when starting a run

When a project setting shows "inherited", it's using the team default (if set) or falling back to your global default.

### Push to Projects

The **Push to Projects** button resets all project-level automation overrides back to "inherit", so every project picks up the current team defaults. Useful after changing a team-wide policy.

## Team Storage

When using **Trinity Cloud** storage, each seat contributes 5 GB to a shared team pool. A 5-seat team gets 25 GB total, shared across all team projects.

If the team needs more space, the team owner can purchase 10 GB add-on packs for $5/month each. Teams using **BYO S3** storage are not subject to any Trinity storage limits.

## Collaboration Features

Teams get real-time collaboration tools:

### Comments

Leave comments on stories, epics, and other entities. Comments sync across all team members and show in the entity's detail view. Edit or delete your own comments.

### Activity Feed

The **Activity** page in the sidebar is a global standalone feed showing all actions across your projects. Filter by:

- **Project** — narrow to a specific project
- **Category** — Execution, Stories, Projects, Assets, Planning, Releases, Teams, or Comments
- **Actor** — filter by team member or system actions

In team scope, the feed shows activity from all team members. In personal scope, it shows only your own actions. Each entry shows who did what, when, and on which entity — with links to jump directly to the relevant story, release, or project.

### Presence

When viewing stories or other entities, you'll see avatar indicators showing which team members are currently viewing the same item. Presence updates in real time.

### Entity Timeline

Each entity (story, epic, phase, release) has a timeline tab showing its full history — who changed what, when, and why. Changes are grouped by action with expandable field-level diffs (old value → new value). Provenance badges link back to originating audit or alignment reports. System actions (from the execution pipeline) show as "Trinity".

## Moving Projects Between Scopes

Transfer projects between personal and team scopes from **Project Settings** → **Danger Zone**:

- **Personal → Team** — share a project with your team. Data syncs to the team database, cloud assets migrate automatically.
- **Team → Personal** — take a project back to your personal scope.

Requires typing the project name to confirm.

## How Sync Works

- All planning data (PRDs, stories, knowledge base) syncs via Turso in 1-5 seconds
- Execution jobs sync so team members see who's running what
- Machine-specific data (worktrees, worker processes, file paths) stays local
- Works offline — syncs when reconnected
