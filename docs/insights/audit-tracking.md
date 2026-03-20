# Codebase Audit Tracking

When you import an existing project into Trinity, the codebase analysis can create audit pages that track issues and gaps found in your code. These audit pages live in the knowledge base and use markdown checklists to track what's been addressed.

## How It Works

### 1. Analysis Creates Audit Pages

During the "Import Existing Project" flow, Trinity scans your codebase and identifies areas that need attention — missing tests, security gaps, architectural issues, etc. These findings are saved as audit pages in the knowledge base with checklist items:

```markdown
- [ ] Add input validation to user registration endpoint
- [ ] Set up rate limiting for API routes
- [x] Configure CORS headers (addressed in story 1.2.3)
```

### 2. Create Stories from Audit Items

From an audit page, click **"Address in Add Feature"** to create a new story pre-filled with the audit recommendations. The story gets an `audit_source` reference linking it back to the originating audit page.

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
