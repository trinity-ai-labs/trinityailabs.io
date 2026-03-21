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

## How Sync Works

- All planning data (PRDs, stories, knowledge base) syncs via Turso in 1-5 seconds
- Execution jobs sync so team members see who's running what
- Machine-specific data (worktrees, worker processes, file paths) stays local
- Works offline — syncs when reconnected
