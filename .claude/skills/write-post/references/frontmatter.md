# Blog Post Frontmatter Schema

Every `.mdx` file in `content/blog/` must begin with YAML frontmatter between `---` delimiters.

## Complete Schema

```yaml
---
# Required fields
title: "Your Post Title Here"                    # 50-60 chars ideal for SEO
description: "One-line summary for meta tags."   # 150-160 chars, includes a hook
date: "2026-03-28"                               # Publication date (YYYY-MM-DD)
author:
  name: "Trinity AI Labs"                        # Author display name
category: "Engineering"                          # One of the allowed categories
tags: ["ai-agents", "automation"]                # 2-5 lowercase hyphenated tags
coverImage: "/blog/covers/your-slug.png"         # 1200x630px recommended
coverAlt: "Descriptive alt text for the image"   # Accessible image description

# Optional fields
updated: "2026-03-29"                            # Last updated date (YYYY-MM-DD)
author:
  name: "Trinity AI Labs"
  avatar: "/blog/authors/trinity.png"            # Square image, >=96px
  role: "Engineering"                            # Author's role/title
featured: false                                  # Show as hero card on index
draft: false                                     # Exclude from production build
---
```

## Field Details

### title (required)

- 50-60 characters for optimal SEO display
- Include primary keyword near the front
- Use sentence case, not Title Case: "How agents ship code" not "How Agents Ship Code"
- No trailing periods

### description (required)

- 150-160 characters (Google truncates at ~160)
- This appears in search results and social shares
- Include a hook or value proposition, not just a summary
- Example: "How Trinity's 4-phase agent pipeline moves from planning to merged PR without human intervention."

### date (required)

- Format: `YYYY-MM-DDTHH:MM:SSZ` (UTC timestamp)
- Example: `"2026-03-27T00:00:00Z"`
- Publication date — posts are sorted by this
- Use the actual publication date, not the date you started writing
- Always use UTC (`Z` suffix) to avoid timezone ambiguity

### updated (optional)

- Format: `YYYY-MM-DDTHH:MM:SSZ` (UTC timestamp)
- Set when you significantly update a post
- Used in sitemap `lastModified` and JSON-LD `dateModified`

### author (required)

- `name` is required, everything else is optional
- Default author: `name: "Lorenzo Wynberg"`, `role: "Founder"`
- For guest posts, include `avatar`, `role`, and optionally `bio`
- Avatar images go in `/public/blog/authors/` (square, at least 96px)

### category (required)

Allowed categories:

- **Engineering** — Technical deep dives, architecture, how things work
- **Product** — Feature announcements, product updates, roadmap
- **Company** — Company news, team updates, culture
- **Tutorial** — Step-by-step guides, walkthroughs, how-to content
- **Case Study** — User stories, real-world examples, results

### tags (required)

- 2-5 tags per post
- Lowercase, hyphenated: `"ai-agents"`, `"git-worktrees"`, `"multi-repo"`
- Reuse existing tags when possible for consistency
- Tags appear on post cards and in the post footer

### coverImage (required)

- Path relative to `/public/`: `"/blog/covers/my-slug.png"`
- Recommended size: **1200x630px** (matches OG image ratio)
- Stored in `/public/blog/covers/`
- Use the post slug as the filename: `your-post-slug.png`
- If you don't have a cover image yet, use a placeholder and add `draft: true`

### coverAlt (required)

- Descriptive alt text for the cover image
- Include relevant keywords naturally
- Describe what's in the image, not just the topic

### featured (optional, default: false)

- Set to `true` for one post at a time to show it as the hero card on the blog index
- Only one post should be featured at a time

### draft (optional, default: false)

- Set to `true` to exclude from production builds
- Drafts still appear in development (`npm run dev`)
- Remove `draft: true` (or set to `false`) when ready to publish

## Slug Convention

The filename becomes the URL slug:

- `my-first-post.mdx` → `/blog/my-first-post`
- Lowercase, hyphenated, no dates in the filename
- Keep it short and keyword-rich
- No stop words (a, the, is, of) unless needed for clarity
- Examples: `why-single-agent-fails.mdx`, `trinity-worktree-isolation.mdx`
