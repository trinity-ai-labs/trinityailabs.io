# MDX Component Reference

All components are available automatically in any `.mdx` file in `content/blog/`. No imports needed.

---

## Callout

Highlighted callout block for tips, notes, important info, or warnings.

**Props**: `type` — `"tip"` | `"note"` | `"important"` | `"warning"` (default: `"note"`)

**When to use**: After a complex explanation, to highlight a gotcha, to add a pro-tip, or to warn about a common mistake.

```mdx
<Callout type="tip">
  You can run `npm run check` before committing to catch formatting and type
  errors early.
</Callout>

<Callout type="warning">
  Never force-push to the main branch while agents are executing — it will
  invalidate their worktrees.
</Callout>
```

---

## Quote

Styled pull quote with attribution. Emerald left border accent.

**Props**: `author` (optional), `role` (optional), `children`

**When to use**: For user testimonials, expert opinions, or to emphasize a key statement from the article itself.

```mdx
<Quote author="Sarah Chen" role="Staff Engineer at Acme">
  We went from shipping bi-weekly to shipping daily. The audit step alone saved
  us 10 hours a week in code review.
</Quote>

<Quote>
  The best IDE isn't the one that writes code fastest — it's the one that ships
  features most reliably.
</Quote>
```

---

## StepList + Step

Numbered step-by-step sequence with emerald gradient indicators and connecting lines.

**When to use**: Tutorials, how-to guides, onboarding flows, any sequential process.

```mdx
<StepList>
  <Step>
    ### Create a new project

    Open Trinity and click **New Project**. Select the repos you want to include.

  </Step>
  <Step>
    ### Write your PRD

    Describe what you want to build in plain language. Trinity's planning pipeline will structure it into stories.

  </Step>
  <Step>
    ### Start execution

    Review the generated stories, then hit **Execute**. Agents will work through each story in parallel.

  </Step>
</StepList>
```

---

## FeatureHighlight

Highlighted feature box with an icon, title, and description. Emerald border accent.

**Props**: `icon` (optional: `"zap"` | `"shield"` | `"code"` | `"globe"` | `"sparkles"`), `title`, `children`

**When to use**: To call out a specific feature or capability within a broader discussion.

```mdx
<FeatureHighlight icon="shield" title="Automatic Auditing">
  Every story goes through an Auditor agent that checks code quality, test
  coverage, and adherence to your project's conventions before it can be merged.
</FeatureHighlight>

<FeatureHighlight icon="zap" title="Parallel Execution">
  Stories without dependencies run simultaneously in isolated worktrees. No
  waiting, no conflicts.
</FeatureHighlight>
```

---

## ComparisonTable

Side-by-side comparison table with styled headers and hover rows.

**Props**: `headers` (string array), `rows` (string[][] — array of row arrays)

**When to use**: Comparing approaches, tools, features, before/after scenarios.

```mdx
<ComparisonTable
  headers={["Aspect", "Traditional IDE", "Trinity"]}
  rows={[
    ["Planning", "External docs / tickets", "Built-in structured PRDs"],
    ["Execution", "Manual coding", "Multi-agent pipeline"],
    ["Review", "Manual PR review", "Automated auditing + human gates"],
    ["Knowledge", "Tribal / scattered", "Centralized vault with learnings"],
    ["Isolation", "Feature branches", "Per-story git worktrees"],
  ]}
/>
```

---

## ImageGallery

Responsive image grid with click-to-expand lightbox.

**Props**: `images` — array of `{ src: string, alt: string, caption?: string }`

**When to use**: Product screenshots, visual walkthroughs, before/after comparisons, design showcases.

```mdx
<ImageGallery
  images={[
    {
      src: "/blog/covers/dashboard-overview.png",
      alt: "Trinity dashboard showing active stories",
      caption: "The main dashboard with 3 stories in progress",
    },
    {
      src: "/blog/covers/execution-pipeline.png",
      alt: "Execution pipeline visualization",
      caption: "Stories flowing through the 4-phase pipeline",
    },
  ]}
/>
```

---

## VideoEmbed

Responsive YouTube or Vimeo embed with lazy loading.

**Props**: `url` (YouTube or Vimeo URL), `title` (optional, for accessibility)

**When to use**: Demo videos, tutorials, conference talks, product walkthroughs.

```mdx
<VideoEmbed
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Trinity Demo: Shipping a Feature in 10 Minutes"
/>
```

Supports URL formats:

- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`
- `https://vimeo.com/...`

---

## AuthorCard

Inline author card for guest posts or multi-author articles.

**Props**: `name`, `avatar` (optional, path to image), `role` (optional), `bio` (optional)

**When to use**: Guest posts, interviews, multi-contributor articles, "about the author" at start of post.

```mdx
<AuthorCard
  name="Alex Rivera"
  avatar="/blog/authors/alex.png"
  role="Principal Engineer at Startup Co"
  bio="Alex has been building developer tools for 12 years. They led the migration from monolith to microservices at Startup Co."
/>
```

---

## Code Blocks (Standard Markdown)

Fenced code blocks are automatically syntax-highlighted with Shiki (github-dark-dimmed theme) and get a copy-to-clipboard button on hover.

````mdx
```typescript
const stories = await getAllStories(projectId);
const ready = stories.filter((s) => s.status === "ready");
await executeInParallel(ready);
```
````

For code blocks with a filename header, wrap in the CodeBlock component:

````mdx
<CodeBlock filename="src/lib/pipeline.ts">
```typescript
export async function runPipeline(story: Story) {
  await analyze(story);
  await implement(story);
  await audit(story);
  await document(story);
}
````

</CodeBlock>
```

---

## Standard Markdown Elements

These all work inside MDX and are styled by the `docs-prose` class:

### Images

```mdx
![Alt text describing the image](/blog/covers/my-image.png)
```

Images are automatically wrapped with `next/image` for optimization.

### Links

```mdx
[Link text](/docs/getting-started/welcome)
[External link](https://github.com/example)
```

External links automatically open in a new tab.

### Tables

```mdx
| Feature            | Status  |
| ------------------ | ------- |
| Worktree isolation | Shipped |
| Multi-repo support | Beta    |
```

### Blockquotes

```mdx
> This is a standard blockquote for shorter, inline quotes.
```

For attributed quotes with styling, use the `<Quote>` component instead.

---

## Component Pairing Recommendations

| Content Scenario            | Recommended Components                |
| --------------------------- | ------------------------------------- |
| Tutorial / how-to           | StepList, CodeBlock, Callout (tips)   |
| Feature announcement        | FeatureHighlight, ImageGallery, Quote |
| Comparison post             | ComparisonTable, Callout, Quote       |
| Deep dive / technical       | CodeBlock, Callout, StepList          |
| Case study                  | Quote, ImageGallery, ComparisonTable  |
| Vision / thought leadership | Quote, FeatureHighlight, Callout      |
