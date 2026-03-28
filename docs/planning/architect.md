# Architect

The Architect flow lets you add new stories to an existing PRD, modify existing stories, or create entirely new PRDs — all through a conversational interface.

## Accessing Architect

1. Navigate to **Plan**
2. Click the **Architect** button

## The Conversation

Describe what you want in natural language. You can:

- Request new features ("Add user profile pages with avatar upload")
- Describe bug fixes ("Fix the login flow when session expires")
- Ask for modifications ("Change the dashboard to show weekly stats instead of daily")
- Request restructuring ("Split the monolithic API into microservices")

You can also attach files (specs, wireframes, designs) to provide additional context.

## Scope Classification

Trinity analyzes your request and classifies it into one of four modes:

### Add Mode

New stories are generated and added to the existing PRD. This is the most common mode — used when you're adding net-new functionality.

### Modify Mode

Existing stories are updated based on your request. Trinity identifies which stories are affected and generates modifications. Stories that are already completed, merged, or currently executing are protected from changes.

### Restructure Mode

Larger structural changes that may affect multiple epics or phases. Similar to modify but with broader scope.

### New PRD Mode

For requests large enough to warrant their own PRD. Trinity launches the full planning wizard to generate a new PRD rather than modifying the existing one.

## Story Preview

Before any changes are applied, you see a preview showing:

### Adding

New stories that will be created, with their descriptions, acceptance criteria, and proposed placement in the PRD structure.

### Modifying

Existing stories that will be changed, showing what's different. Each modification shows the story ID, current state, and proposed changes.

### Removing

Stories that would be removed. Each removal includes a reason explaining why it's no longer needed.

## Confirming Changes

Review the preview and use checkboxes to include or exclude individual changes. Click **Confirm** to apply the selected changes to your PRD.

## Story Modifications

When stories are modified, Trinity respects safety boundaries:

- **Safe to modify** — stories that are pending (not yet started)
- **Protected** — stories that are completed, merged, skipped, or currently being executed by a worker

Protected stories are flagged in the preview but can't be modified. If you need to change completed work, create a new story that builds on what was done.

## From Audit Pages

You can also reach Architect from the Knowledge Base:

1. Navigate to an audit page in the vault
2. Click **Address in Architect**
3. The audit findings are pre-loaded as context for story generation

This creates stories with an `audit_source` reference, linking them back to the originating audit. After the stories execute and merge, Trinity automatically re-checks the audit items.

## From Align

After running an alignment check, findings can be sent to Architect:

1. Run **Align** from the sidebar
2. Review the findings
3. Click **Send to Architect** on findings you want to address

The findings provide context for generating targeted fix stories.

## Tips

- **Be specific about scope** — "Add user authentication" is broad; "Add email/password login with forgot-password flow using NextAuth" is better
- **Reference existing features** — "Add filtering to the existing product list page" helps Trinity understand the context
- **One feature at a time** — for complex additions, it's better to do multiple Architect passes than one huge request
- **Attach references** — wireframes, API specs, or design mockups help agents implement exactly what you want
