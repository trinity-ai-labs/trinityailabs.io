---
name: write-post
description: Write rich, SEO-optimized blog posts for trinityailabs.com with proper MDX formatting, brand voice, and storytelling
argument-hint: "[topic]"
---

# Blog Post Writer

Write a publication-ready MDX blog post for the Trinity AI Labs blog at `content/blog/`.

## Step 1: Gather Context

If the user provided a topic via `$ARGUMENTS`, use it. Otherwise, ask them.

Before writing, ask the user these questions using AskUserQuestion (all in one call):

1. **Topic**: What's the post about? What's the working title or core idea?
2. **Audience**: Who is this for?
   - Developers (technical, show code and architecture)
   - Technical leaders / CTOs (outcomes, metrics, team efficiency)
   - General tech audience (vision, analogies, less jargon)
3. **Category**: Which category?
   - Engineering — technical deep dives, architecture
   - Product — feature announcements, updates
   - Company — news, team, culture
   - Tutorial — step-by-step guides
   - Case Study — real-world results
4. **Format**: What storytelling approach?
   - Narrative (problem → agitation → solution)
   - Tutorial (step-by-step how-to)
   - Deep Dive (one concept explored thoroughly)
   - Comparison (honest side-by-side analysis)
   - Vision / Thought Leadership (where the industry is going)
   - Announcement (what's new, why, how to use it)

Also ask:
- **Key points** they want covered (or leave to your judgment)
- **Target length**: Short (~800 words), Medium (~1500 words), or Long (~2500 words)
- **Any specific MDX components** they want used (gallery, video, comparison table, etc.)

## Step 2: Research

Before writing, do this research:

1. **Read the reference guides** — you must internalize these before writing:
   - [Brand Voice](./references/voice.md) — tone, vocabulary, framing
   - [Storytelling & Marketing](./references/storytelling.md) — frameworks, hooks, pacing, archetypes
   - [MDX Components](./references/components.md) — available components and when to use each
   - [Frontmatter Schema](./references/frontmatter.md) — required fields and conventions
   - [SEO Checklist](./references/seo.md) — optimization requirements

2. **Product accuracy** — if the post discusses Trinity features:
   - Read relevant docs in `/docs/` for accurate descriptions
   - Check `/components/landing/` files for current marketing language
   - Reference the user guide structure in `/lib/docs-structure.ts` for internal link opportunities

3. **Existing content** — check `content/blog/` for:
   - Existing posts to avoid topic overlap
   - Internal linking opportunities
   - Consistent tag and category usage

4. **Competitor & landscape context** — for comparison or thought leadership posts:
   - Web search what competitors and the community say about the topic
   - Identify the common takes so you can offer a fresh angle, not rehash what's already out there
   - Reference or credit original sources where relevant (e.g., if discussing autonomous coding patterns, credit their originators)

## Step 3: Write the Post

Create the file at `content/blog/{slug}.mdx` where `{slug}` is a short, keyword-rich, hyphenated name.

### Writing Rules

**Voice** (from voice.md):
- Direct and confident — no hedging ("can help" → "does")
- Active voice — "agents write PRs" not "PRs are written"
- Specificity over generality — name the pipeline stages, show the architecture
- Problem-first — open with the pain, then the solution
- Action verbs: ship, build, execute, orchestrate, plan, review

**Structure** (from storytelling.md):
- Apply the storytelling framework matching the user's chosen format
- Open with a compelling hook (contrarian statement, specific result, scene-setting, or bold claim)
- Subheadings should be mini-hooks, not generic labels
- Vary paragraph length: single-sentence punches between 2-3 sentence explanations
- End sections with forward-pulling transitions
- Close by circling back to the opener, distilling one key takeaway, and an appropriate CTA

**Components** (from components.md):
- Use at least 2-3 MDX components naturally throughout
- Place Callouts after complex explanations
- Use Quotes for emphasis or testimonials
- Use StepList for any sequential process
- Use ComparisonTable when contrasting approaches
- Use FeatureHighlight to spotlight specific capabilities
- Use CodeBlock with `filename` prop for code examples

**SEO** (from seo.md):
- Title: 50-60 chars, primary keyword near front
- Description: 150-160 chars with a hook
- Primary keyword in first 100 words and at least one H2
- 2-4 internal links to `/docs/` pages or other blog posts
- Heading hierarchy: H2 → H3, never skip levels
- Short paragraphs, scannable structure

### Frontmatter Template

```yaml
---
title: ""
description: ""
date: "YYYY-MM-DD"
author:
  name: "Lorenzo Wynberg"
  role: "Founder"
category: ""
tags: []
coverImage: "/blog/covers/{slug}.png"
coverAlt: ""
featured: false
draft: true
---
```

Set `draft: true` initially since the cover image won't exist yet. The user can set it to `false` and add the cover image when ready to publish.

## Step 4: Post-Write Verification

After writing the file, verify:

1. **Frontmatter** — all required fields present and valid
2. **SEO** — run through the checklist mentally:
   - Title length (50-60 chars)
   - Description length (150-160 chars)
   - Keyword in first 100 words
   - Keyword in at least one H2
3. **Heading hierarchy** — H2 → H3, no skipping, no duplicate IDs
4. **MDX syntax** — all component tags are properly closed, props are correct
5. **Internal links** — at least 2 links to `/docs/` pages
6. **Readability** — short paragraphs, scannable, active voice throughout
7. **Brand voice** — confident, specific, no hedging or buzzwords

Tell the user:
- The post is saved at `content/blog/{slug}.mdx` with `draft: true`
- They need to add a cover image at `/public/blog/covers/{slug}.png` (1200x630px)
- When ready, set `draft: false` in the frontmatter to publish
- Run `npm run build` to verify it compiles
- Preview at `http://localhost:3100/blog/{slug}` during dev
