/**
 * Blog content layer — reads MDX from disk, parses frontmatter, provides
 * helpers for listings, filtering, and TOC extraction.
 *
 * For MDX compilation, use next-mdx-remote/rsc in the page component
 * with the exported `mdxOptions` config.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { TableOfContentsItem } from "./docs-structure";

export type { TableOfContentsItem };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogAuthor {
  name: string;
  avatar?: string;
  role?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  draft: boolean;
  readingTime: string;
  raw: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function getBlogFiles(): string[] {
  try {
    return fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .sort();
  } catch {
    return [];
  }
}

function parsePost(filename: string): BlogPost | null {
  const slug = filename.replace(/\.mdx$/, "");
  const filePath = path.join(BLOG_DIR, filename);
  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  if (data.draft && process.env.NODE_ENV === "production") return null;

  const author: BlogAuthor =
    typeof data.author === "string"
      ? { name: data.author }
      : { name: data.author?.name ?? "Trinity AI Labs", ...data.author };

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString().slice(0, 10),
    updated: data.updated,
    author,
    category: data.category ?? "General",
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? "",
    coverAlt: data.coverAlt ?? data.title ?? slug,
    featured: data.featured ?? false,
    draft: data.draft ?? false,
    readingTime: readingTime(content).text,
    raw: content,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getAllPosts(): BlogPost[] {
  return getBlogFiles()
    .map(parsePost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.mdx`;
  const filePath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filename);
}

export function getAllCategories(): string[] {
  const cats = new Set(getAllPosts().map((p) => p.category));
  return [...cats].sort();
}

export function getAllTags(): string[] {
  const tags = new Set(getAllPosts().flatMap((p) => p.tags));
  return [...tags].sort();
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3,
): BlogPost[] {
  const all = getAllPosts().filter((p) => p.slug !== currentSlug);

  const scored = all.map((post) => {
    let score = 0;
    if (post.category === category) score += 3;
    for (const tag of tags) {
      if (post.tags.includes(tag)) score += 1;
    }
    return { post, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

/** Extract h2/h3 headings for a table of contents (strips MDX component lines). */
export function extractBlogToc(raw: string): TableOfContentsItem[] {
  const items: TableOfContentsItem[] = [];
  for (const line of raw.split("\n")) {
    // Skip JSX/MDX component lines
    if (line.trimStart().startsWith("<")) continue;
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

// ---------------------------------------------------------------------------
// MDX compilation options — pass to <MDXRemote options={{ mdxOptions }} />
// ---------------------------------------------------------------------------

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" as const }],
    [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }],
  ],
};
