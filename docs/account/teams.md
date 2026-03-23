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
| **Owner** | Everything — manage members, billing, secrets, delete projects, approve checkpoints |
| **Member** | Edit PRDs, run stories, respond to story gates, create projects |

## Inviting Members

Only the team owner can invite:

1. Go to **Teams** page or the website dashboard
2. Enter the person's email
3. They receive an invite email with a link
4. They click the link, sign in (or create an account), and join

## Team Settings

Team owners can configure team-wide defaults that sit between global (personal) settings and per-project overrides:

1. Switch to a team scope using the team switcher
2. Click **Team Settings** in the sidebar (only visible to team owners)

### What You Can Configure

| Category | Settings |
|----------|----------|
| **Automation** | Auto PR, Auto Merge, Squash Merge, Delete After Merge, Skip Asset Check, Skip Business Details Check, Auto Release to Base, Delete Release Branch, Auto-Approve Quality Checkpoints |
| **AI Models** | Default models for each tier (Reasoning, Standard, Fast, Micro) |

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

## How Sync Works

- All planning data (PRDs, stories, knowledge base) syncs via Turso in 1-5 seconds
- Execution jobs sync so team members see who's running what
- Machine-specific data (worktrees, worker processes, file paths) stays local
- Works offline — syncs when reconnected
