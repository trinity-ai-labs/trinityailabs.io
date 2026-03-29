# Gotchas Library

The Gotchas library is a curated collection of pitfalls, workarounds, and "things that will bite you" organized by technology. It helps agents avoid known issues during implementation.

## What Are Gotchas?

Gotchas are documented problems that developers commonly encounter with specific technologies. They include:

- Common mistakes and their fixes
- Undocumented behavior
- Version-specific breaking changes
- Configuration traps
- Performance pitfalls

## Structure

Gotchas are organized into three books:

### Languages

Pitfalls specific to programming languages:

- TypeScript quirks (type narrowing edge cases, declaration merging)
- Python gotchas (mutable defaults, import cycles)
- Go subtleties (goroutine leaks, nil interfaces)

### Frameworks

Framework-specific issues:

- React (stale closures, useEffect dependencies)
- Next.js (server/client boundary, caching behavior)
- Express (middleware ordering, error handling)
- And many more based on your tech stack

### Tools

Tooling and infrastructure gotchas:

- Database drivers (connection pooling, migration edge cases)
- Build tools (bundler quirks, tree-shaking failures)
- Testing frameworks (async timing, mock cleanup)

## How Gotchas Accumulate

### From Execution

When the Documenter agent finishes a story, it records any gotchas discovered during implementation. These are real, encountered-in-the-wild issues — not theoretical concerns.

### From Audits

Codebase analysis may identify patterns that match known gotchas. These are added to help future stories avoid the same traps.

### Deduplication

Gotchas are automatically deduplicated by slug. If an agent encounters the same gotcha twice, the existing entry is updated rather than duplicated.

## How Agents Use Gotchas

During the analyst phase, agents check the gotchas library for issues relevant to their story's tech stack. This happens via the `/vault` skill:

1. Agent identifies the technologies involved in the story
2. Queries the gotchas API for matching entries
3. Incorporates relevant gotchas into the implementation plan
4. Avoids known pitfalls during coding

The auditor also checks gotchas during code review, flagging code patterns that match documented issues.

## Viewing Gotchas

1. Navigate to **Knowledge** in the sidebar
2. Look for the gotchas books (Languages, Frameworks, Tools)
3. Browse by category or use search

Each gotcha entry typically includes:

- **Title** — what the issue is
- **Description** — detailed explanation
- **Example** — code showing the problem
- **Fix** — how to avoid or resolve it
- **Context** — when this matters (versions, configurations)

## Gotchas vs. Knowledge Base

| Gotchas                              | Knowledge Base                        |
| ------------------------------------ | ------------------------------------- |
| Technology-specific pitfalls         | Project-specific documentation        |
| Shared across projects               | Scoped to one project                 |
| Accumulated from execution           | Built during onboarding + execution   |
| Read-mostly (agents learn from them) | Read-write (agents update frequently) |

Both are stored in the same underlying database and accessed through the same vault system. The distinction is in the `book_type` field: `gotchas` vs. `knowledge`.

## Contributing Gotchas

While agents primarily populate the gotchas library, you can also add entries manually:

1. Navigate to the relevant gotchas book
2. Find or create the appropriate chapter
3. Add a new page with the gotcha details

Format entries clearly — agents read them programmatically, so structure matters:

```markdown
# Short descriptive title

## Problem

What goes wrong and when.

## Example

Code showing the issue.

## Fix

How to avoid or resolve it.
```
