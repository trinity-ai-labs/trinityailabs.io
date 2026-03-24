# Knowledge Base

The Knowledge Base (also called the Vault) is Trinity's persistent memory system. It stores project documentation, architecture decisions, learnings from execution, and audit reports.

## Accessing the Knowledge Base

Click **Knowledge** in the sidebar.

## Structure

The knowledge base is organized hierarchically:

### Books

Top-level containers. You'll typically see:

- **Your project name** — project-specific knowledge
- **Gotchas** — libraries of pitfalls (languages, frameworks, tools)
- **Trinity User Guide** — this guide

### Sections

Groupings within a book. For project knowledge, default sections include:

- **Roadmap** — project vision, phases, milestones
- **Architecture** — system design, data models, decisions, patterns
- **Operations** — setup, running, deployment guides
- **Audits** — codebase analysis reports
- Per-target sections (e.g., "Web App", "API") with technical references

### Chapters

Topic areas within a section. Chapters contain the actual content pages.

### Pages

Individual knowledge articles written in markdown. Pages can be:

- **System-generated** — created by Trinity during onboarding or execution
- **Agent-written** — created by the Documenter agent after story execution
- **User-written** — manually created or edited by you

## How Knowledge Accumulates

### During Onboarding

The onboarding wizard creates initial pages:

- Roadmap overview, vision, phases, milestones
- Architecture notes from your tech stack choices

### During Import

The Import Existing flow generates:

- Architecture documentation
- Tech stack inventory
- Feature catalog
- Setup guide

### During Execution

After each story, the Documenter agent writes:

- **What was built** — summary of changes
- **Decisions made** — why certain approaches were chosen
- **Discoveries** — unexpected findings about the codebase
- **Patterns** — reusable patterns identified during implementation

### During Audits

Codebase analysis creates audit pages with:

- Checklist items for improvements
- Severity ratings
- Recommendations

These checklists update automatically — when stories address audit items and merge, Trinity re-scans and checks off resolved items.

## Searching

Use the search bar at the top of the Knowledge page to find content across all books:

- Search by keyword
- Results show matching pages with context
- Click a result to navigate directly to the page

## Agent Access

Agents have full access to the knowledge base during execution:

- The **Analyst** reads relevant knowledge before planning
- The **Implementer** consults architecture docs and patterns
- The **Auditor** checks for known gotchas
- The **Documenter** writes new entries

Agents access the vault through the `/vault` skill, which provides API endpoints for reading and writing.

## The Audit Workflow

A powerful cycle connects audits to execution:

1. **Analyze** — run a codebase analysis (via Import or manually)
2. **Audit pages created** — checklists of improvements land in the vault
3. **Address items** — click "Implement" from an audit page
4. **Stories generated** — with `audit_source` linking back to the audit
5. **Execute** — agents implement the fixes
6. **Auto-check** — after merge, Trinity re-scans and checks off addressed items
7. **Re-check** — manually trigger a re-check to verify remaining items

## Exporting

Export the entire knowledge base as a markdown zip:

1. Navigate to Knowledge
2. Click the export button
3. Download the generated zip file

The export includes all books, chapters, and pages organized in a directory structure matching the vault hierarchy.

## Tips

- **Read before planning** — review vault content before generating new PRDs to avoid duplicating existing knowledge
- **Trust agent entries** — the Documenter writes factual, code-verified entries
- **Clean up periodically** — remove outdated pages that no longer reflect the codebase
- **Use sections** — organize content logically so agents can find what they need quickly
