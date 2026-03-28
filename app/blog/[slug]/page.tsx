import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  extractBlogToc,
  mdxOptions,
} from "@/lib/blog";
import { TableOfContents } from "@/components/docs/toc";
import { mdxComponents } from "@/components/blog/mdx";
import { PostHeader } from "@/components/blog/post-header";
import { PostFooter } from "@/components/blog/post-footer";
import { ReadingProgress } from "@/components/blog/reading-progress";

const BASE_URL = "https://trinityailabs.com";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// ---------------------------------------------------------------------------
// Metadata + JSON-LD
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const postUrl = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractBlogToc(post.raw);
  const related = getRelatedPosts(slug, post.category, post.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${BASE_URL}/blog/${slug}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "Trinity AI Labs",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
        {/* Main content */}
        <article className="min-w-0 flex-1 max-w-3xl mx-auto lg:mx-0">
          <PostHeader post={post} />
          <div className="docs-prose">
            <MDXRemote
              source={post.raw}
              options={{ mdxOptions: mdxOptions as never, blockJS: false }}
              components={mdxComponents}
            />
          </div>
          <PostFooter post={post} relatedPosts={related} />
        </article>

        {/* TOC sidebar */}
        {toc.length > 0 && <TableOfContents items={toc} />}
      </div>
    </>
  );
}
