import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocPage, DOC_SECTIONS } from "@/lib/docs";
import { TableOfContents } from "@/components/docs/toc";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ section: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  for (const s of DOC_SECTIONS) {
    for (const c of s.chapters) {
      params.push({ section: s.slug, slug: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const page = await getDocPage(section, slug);
  if (!page) return {};
  return {
    title: page.chapter.pageTitle,
    description: `Trinity documentation — ${page.chapter.pageTitle}`,
  };
}

export default async function DocPage({ params }: Props) {
  const { section, slug } = await params;
  const page = await getDocPage(section, slug);
  if (!page) notFound();

  return (
    <div className="flex">
      {/* Main content column */}
      <article className="flex-1 min-w-0 max-w-[46rem] mx-auto px-6 sm:px-10 py-12 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-muted-foreground mb-8">
          <Link
            href="/docs"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground/80">{page.section.name}</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-medium">
            {page.chapter.title}
          </span>
        </nav>

        {/* Title */}
        <header className="mb-10">
          <h1 className="text-[2rem] font-bold tracking-tight leading-tight">
            {page.chapter.pageTitle}
          </h1>
          <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
        </header>

        {/* Rendered markdown */}
        <div
          className="docs-prose"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        {/* Prev / Next navigation */}
        <nav className="mt-20 grid grid-cols-2 gap-4">
          {page.prev ? (
            <Link
              href={`/docs/${page.prev.section}/${page.prev.slug}`}
              className="group flex flex-col gap-1.5 rounded-xl border border-border p-5 hover:border-emerald-500/30 hover:bg-emerald-500/[3%] transition-all"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Previous
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                {page.prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {page.next ? (
            <Link
              href={`/docs/${page.next.section}/${page.next.slug}`}
              className="group flex flex-col gap-1.5 rounded-xl border border-border p-5 hover:border-emerald-500/30 hover:bg-emerald-500/[3%] transition-all text-right items-end"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                Next
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                {page.next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>

      {/* Table of Contents — right rail */}
      {page.toc.length > 0 && <TableOfContents items={page.toc} />}
    </div>
  );
}
