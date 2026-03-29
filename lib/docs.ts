/**
 * Server-only doc utilities — reads markdown from disk, renders to rich HTML.
 * For client-safe types and structure, import from './docs-structure'.
 */

import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import {
  DOC_SECTIONS,
  type DocSection,
  type DocChapter,
  type TableOfContentsItem,
} from "./docs-structure";

export { DOC_SECTIONS };
export type { DocSection, DocChapter, TableOfContentsItem };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DOCS_DIR = path.join(process.cwd(), "docs");

function readDocFile(section: string, slug: string): string {
  const filePath = path.join(DOCS_DIR, section, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

/**
 * Pre-process markdown to transform patterns into custom HTML:
 * - **Tip:** / **Note:** / **Important:** / **Warning:** → callout blocks
 * - **When:** / **What you see:** / **Actions:** → definition blocks
 */
function preProcessMarkdown(md: string): string {
  const lines = md.split("\n");
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect callout patterns: lines starting with **Tip:**, **Note:**, **Important:**, **Warning:**
    const calloutMatch = line.match(
      /^\*\*(Tip|Note|Important|Warning):\*\*\s*(.*)/,
    );
    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase();
      const content = calloutMatch[2];
      // Collect continuation lines
      const contentLines = [content];
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() !== "" &&
        !lines[i + 1].match(/^[#*\-\d]/) &&
        !lines[i + 1].match(/^\*\*(Tip|Note|Important|Warning):\*\*/)
      ) {
        i++;
        contentLines.push(lines[i]);
      }
      output.push(
        `<div class="docs-callout docs-callout-${type}">`,
        `<div class="docs-callout-label">${calloutMatch[1]}</div>`,
        `<div class="docs-callout-content">${contentLines.join(" ")}</div>`,
        `</div>`,
        "",
      );
      i++;
      continue;
    }

    // Detect standalone tip lines with "Tip:" prefix (often in existing docs)
    const tipLineMatch = line.match(/^\*\*Tip:\*\*\s+(.+)/);
    if (tipLineMatch && !calloutMatch) {
      output.push(
        `<div class="docs-callout docs-callout-tip">`,
        `<div class="docs-callout-label">Tip</div>`,
        `<div class="docs-callout-content">${tipLineMatch[1]}</div>`,
        `</div>`,
        "",
      );
      i++;
      continue;
    }

    // Detect definition-style blocks: **When:** / **What you see:** / **Actions:**
    const defMatch = line.match(
      /^\*\*(When|What you see|Actions|Auto-approve):\*\*\s*(.*)/,
    );
    if (defMatch) {
      const label = defMatch[1];
      const content = defMatch[2];
      output.push(
        `<div class="docs-def">`,
        `<span class="docs-def-label">${label}</span>`,
        `<span class="docs-def-content">${content}</span>`,
        `</div>`,
      );
      i++;
      continue;
    }

    output.push(line);
    i++;
  }

  return output.join("\n");
}

export async function renderMarkdown(markdown: string): Promise<string> {
  // Pre-process for callouts and definitions
  const processed = preProcessMarkdown(markdown);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processed);
  return String(result);
}

/** Extract headings for a table of contents sidebar. */
export function extractToc(markdown: string): TableOfContentsItem[] {
  const items: TableOfContentsItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      items.push({ id, text, level });
    }
  }
  return items;
}

export interface DocPage {
  section: DocSection;
  chapter: DocChapter;
  html: string;
  toc: TableOfContentsItem[];
  prev: { section: string; slug: string; title: string } | null;
  next: { section: string; slug: string; title: string } | null;
}

/** Build a flat ordered list of all (section, chapter) pairs for prev/next nav. */
function flatChapters() {
  const list: { section: string; slug: string; title: string }[] = [];
  for (const s of DOC_SECTIONS) {
    for (const c of s.chapters) {
      list.push({ section: s.slug, slug: c.slug, title: c.title });
    }
  }
  return list;
}

export async function getDocPage(
  sectionSlug: string,
  chapterSlug: string,
): Promise<DocPage | null> {
  const section = DOC_SECTIONS.find((s) => s.slug === sectionSlug);
  if (!section) return null;
  const chapter = section.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return null;

  const markdown = readDocFile(sectionSlug, chapterSlug);
  if (!markdown) return null;

  // Strip the first H1 (we render the title from metadata)
  const contentWithoutH1 = markdown.replace(/^#\s+.+\n+/, "");

  const html = await renderMarkdown(contentWithoutH1);
  const toc = extractToc(contentWithoutH1);

  const flat = flatChapters();
  const idx = flat.findIndex(
    (f) => f.section === sectionSlug && f.slug === chapterSlug,
  );

  return {
    section,
    chapter,
    html,
    toc,
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
