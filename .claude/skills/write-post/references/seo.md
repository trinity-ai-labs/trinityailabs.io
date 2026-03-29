# SEO Checklist for Blog Posts

Run through this checklist for every blog post before publishing.

---

## Title Tag (Frontmatter `title`)

- [ ] 50-60 characters (Google truncates at ~60)
- [ ] Primary keyword appears within the first 5 words
- [ ] Compelling — would you click this in search results?
- [ ] Unique — doesn't duplicate another post's title
- [ ] No clickbait — the post delivers on the title's promise

**Good**: "How Isolated Git Worktrees Eliminate Merge Conflicts"
**Bad**: "A Deep Dive Into Some Really Cool Features of Our Amazing Tool"

## Meta Description (Frontmatter `description`)

- [ ] 150-160 characters (Google truncates at ~160)
- [ ] Includes primary keyword naturally
- [ ] Contains a hook or value proposition
- [ ] Reads as a compelling reason to click
- [ ] Ends with a complete thought (not mid-sentence truncation)

**Good**: "How Trinity's multi-agent pipeline isolates each story in its own worktree, eliminating merge conflicts and enabling true parallel development." (148 chars)
**Bad**: "This post talks about Trinity's features and how they can help developers." (74 chars — too short, no hook)

## URL Slug (Filename)

- [ ] Short: 3-6 words ideal
- [ ] Includes primary keyword
- [ ] No stop words (a, the, is, of) unless necessary
- [ ] Lowercase, hyphenated
- [ ] No dates in the slug

**Good**: `worktree-isolation-merge-conflicts`
**Bad**: `a-deep-dive-into-how-trinity-uses-git-worktrees-for-code-isolation-2026`

## Heading Hierarchy

- [ ] Exactly one H1 — this is the `title` from frontmatter (rendered by PostHeader)
- [ ] H2s for main sections — each should contain a keyword variation
- [ ] H3s for subsections within H2s
- [ ] Never skip levels (H2 → H4 without H3)
- [ ] Headings are descriptive, not generic ("Why Four Agents Beat One" not "Details")
- [ ] Headings work as a scannable outline of the post

## Keyword Strategy

- [ ] Primary keyword appears in: title, description, first 100 words, at least one H2
- [ ] Secondary keywords appear in H2s and body naturally
- [ ] No keyword stuffing — if a sentence reads awkwardly, remove the keyword
- [ ] Keywords match what developers would actually search for
- [ ] Long-tail keywords in H3s where relevant

**Keyword research tip**: Think about what a developer would type into Google when facing the problem your post solves. That query is your primary keyword.

## Content Quality

- [ ] First 100 words include the primary keyword and hook the reader
- [ ] Paragraphs are short (2-4 sentences max)
- [ ] Content is scannable — subheadings every 200-300 words
- [ ] Active voice throughout
- [ ] Specific examples, numbers, and evidence — not vague claims
- [ ] Reading level: 8th-10th grade (short sentences, common words)

## Internal Links

- [ ] 2-4 internal links to other blog posts or docs pages
- [ ] Link text is descriptive (not "click here" or "read more")
- [ ] Links are contextually relevant — they add value for the reader
- [ ] Links use relative paths: `/docs/getting-started/welcome` not full URLs

**Doc sections available for linking**:

- `/docs/getting-started/` — Welcome, prerequisites, first project, quickstart
- `/docs/project-setup/` — Repos, codebase analysis, settings
- `/docs/planning/` — PRDs, stories, dependencies, calibration
- `/docs/execution/` — Pipeline, gates, checkpoints, releases
- `/docs/insights/` — Knowledge vault, recaps, reports, metrics
- `/docs/account/` — Auth, teams
- `/docs/configuration/` — Settings, customization

## External Links

- [ ] 1-2 links to authoritative external sources where relevant
- [ ] External links open in new tab (handled automatically by MDX `a` override)
- [ ] Sources are reputable (official docs, peer-reviewed, established publications)
- [ ] No affiliate or sponsored links without disclosure

## Images

- [ ] Cover image: 1200x630px, stored in `/public/blog/covers/`
- [ ] All images have descriptive `alt` text
- [ ] Alt text includes relevant keywords naturally (not stuffed)
- [ ] Images add value — screenshots, diagrams, comparisons (not decorative stock photos)
- [ ] Image file names are descriptive: `worktree-isolation-diagram.png` not `image1.png`

## Technical SEO (Handled Automatically)

These are implemented by the blog infrastructure — no action needed per post:

- [x] JSON-LD Article schema (generated from frontmatter)
- [x] Canonical URL (`/blog/{slug}`)
- [x] OpenGraph meta tags (title, description, image, type)
- [x] Twitter card meta tags (summary_large_image)
- [x] Sitemap inclusion (auto-generated from all posts)
- [x] RSS feed inclusion (auto-generated)
- [x] Dynamic OG image (auto-generated from title, author, category)
- [x] Heading anchors with auto-linking (rehype-slug + rehype-autolink-headings)

## Pre-Publish Final Check

- [ ] Read the post out loud — does it flow naturally?
- [ ] Check the generated OG image at `/blog/{slug}/opengraph-image`
- [ ] Verify the post appears in dev server at `/blog/{slug}`
- [ ] Confirm the blog index shows the post card correctly
- [ ] Run `npm run build` to verify static generation succeeds
