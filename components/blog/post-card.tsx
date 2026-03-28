import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-xl border border-border hover:border-emerald-500/30 transition-all overflow-hidden bg-card"
    >
      {post.coverImage && (
        <div className="overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            width={600}
            height={340}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-[10px]">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {post.readingTime}
          </span>
        </div>
        <h3 className="font-semibold text-lg leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Read more
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
