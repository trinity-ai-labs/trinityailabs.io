# Codebase Audit Tracking

Trinity has a standalone **Audit** feature accessible from the sidebar. It lets you run on-demand codebase quality scans at any time — not just during import. Audit pages track issues and gaps found in your code using markdown checklists in the knowledge base.

## How It Works

### 1. Analysis Creates Audit Pages

You can trigger an audit in two ways:

- **From the sidebar** — click **Audit** and run a scan. You can optionally provide a focus area in the chat (e.g., "security" or "API validation").
- **During import** — the "Import Existing Project" flow automatically scans your codebase.

Either way, Trinity identifies areas that need attention — missing tests, security gaps, architectural issues, etc. These findings are saved as audit pages in the knowledge base with checklist items:

```markdown
- [ ] Add input validation to user registration endpoint
- [ ] Set up rate limiting for API routes
- [x] Configure CORS headers (addressed in story 1.2.3)
```

### 2. Create Stories from Audit Items

From an audit page, click **"Implement"** to send findings to the Architect flow, which generates stories pre-filled with the audit recommendations. Each story gets an `audit_source` reference linking it back to the originating audit page.

### 3. Auto-Check After Merge

When a story with an `audit_source` completes and merges, Trinity automatically re-scans the codebase and checks off any audit items that were addressed. This happens fire-and-forget after the Documenter phase — you don't need to do anything.

### 4. Manual Re-Check

You can also manually trigger a re-check from any audit page to see which items have been addressed since the last scan.

## Audit Source Format

Stories link to audit pages using the format: `bookSlug:chapterSlug:pageSlug`

For example: `audits:security:api-validation` links to the "api-validation" page in the "security" chapter of the "audits" book.

## Tracking Progress

As stories merge and audit items get checked off, you can see your progress toward addressing all the gaps found during the initial analysis. The checklist format makes it easy to see at a glance what's done and what remains.

## Tips

- Use audit tracking to systematically work through technical debt after importing a project
- The auto-check feature means you don't need to manually track which audit items your stories addressed
- You can always manually re-check if you've made changes outside of Trinity's pipeline
