import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog-format";

export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <span>/</span>
        <Link
          href={`/blog?category=${encodeURIComponent(post.category)}`}
          className="hover:text-foreground transition-colors"
        >
          {post.category}
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-tight leading-tight mb-4">
        {post.title}
      </h1>

      {/* Gradient accent */}
      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 mb-6" />

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
        {post.author.avatar && (
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="font-medium text-foreground">{post.author.name}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span>{post.readingTime}</span>
        <Badge variant="secondary" className="ml-1">
          {post.category}
        </Badge>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="rounded-xl overflow-hidden border border-[oklch(1_0_0/8%)]">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            width={1200}
            height={630}
            priority
            className="w-full h-auto"
          />
        </div>
      )}
    </header>
  );
}
