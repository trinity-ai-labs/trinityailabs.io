# App Settings

App-level settings control Trinity's global behavior — preferences that apply across all projects.

## Accessing Settings

Click **Settings** in the sidebar. App settings are on the global settings tab (as opposed to project-specific settings).

## Theme

Trinity supports light and dark themes:

- **Light** — default light appearance
- **Dark** — dark background with light text
- **System** — follows your operating system preference

## Timezone

Your timezone affects:

- Recap date groupings (daily, weekly, etc.)
- Metrics dashboard time axes
- Timestamp displays throughout the UI

The database stores everything in UTC — timezone conversion happens at display time.

## Automation Defaults

Default settings that apply to all projects. The full settings hierarchy is: **Global → Team → Project → Entity → Job**. Team settings (if you're in a team scope) override globals, project settings override both, and per-entity overrides (on individual stories or releases) override project defaults. See [Teams](/account/teams) for team settings details and [Stories](/execution/stories) for per-entity overrides.

### Skip Asset Check

When enabled globally, the "missing assets" execution gate is bypassed for all projects. Useful if you primarily work on projects that don't use uploaded assets.

### Skip Business Details Check

When enabled globally, the "missing business details" execution gate is bypassed. Useful for personal/hobby projects where business branding isn't relevant.

### Auto-Approve Quality Checkpoints

When enabled, quality checkpoints run their full audit pipeline (analyze, audit/fix loop, documentation) but automatically approve the gate instead of pausing for human review. The gate record is still created for audit trail purposes. Release checkpoints always require manual approval regardless of this setting. Can be overridden per-project.

## Help Assistant

A floating help chat is available on every page (bottom-right corner). It answers questions about how to use Trinity using the built-in user guide as its knowledge source.

- Toggle it on/off in app settings
- Supports image uploads — paste or attach screenshots to ask about specific UI elements
- Only answers from documentation — won't execute commands or modify your project
- Maintains conversation history within a session

## Worker Defaults

Default worker configuration for new projects:

- **Max workers** — default number of parallel workers
- **Timeouts** — how long operations can run before being considered stale

## Data Management

### Database Location

The database (`trinity.db`) lives at `~/.trinity/trinity.db` in both development and packaged (Tauri) mode.

### Backups

Trinity automatically creates database backups before running migrations. Backups are stored in the `backups/db/` directory within the data folder.

### Reset

If you need to start fresh:

1. Stop all execution
2. Delete the database file
3. Restart Trinity — a fresh database is created with default migrations

**Warning:** This deletes all project data, knowledge, and execution history. Make sure you've exported anything you need first.

## Keyboard Shortcuts

Trinity uses standard web application shortcuts. There are no custom keybindings to configure — navigation is primarily through the sidebar and in-page buttons.

## Performance

### Refresh Rates

- **Metrics** — 5-second refresh interval
- **Run page** — real-time updates via polling
- **Knowledge base** — loaded on navigation

### Resource Usage

Trinity runs a Node.js server with SQLite. Resource usage scales with:

- Number of parallel workers (each worker spawns a Claude CLI process)
- Database size (grows with execution history)
- Knowledge base size (grows with vault entries)

For most projects, Trinity runs comfortably on a standard development machine.
