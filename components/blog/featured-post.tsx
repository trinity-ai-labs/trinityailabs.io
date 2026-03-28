import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-border hover:border-emerald-500/30 transition-all overflow-hidden bg-card mb-10"
    >
      <div className="grid md:grid-cols-2 gap-0">
        {post.coverImage && (
          <div className="overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              width={700}
              height={400}
              priority
              className="w-full h-full min-h-[240px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 text-[10px]">
              Featured
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {post.category}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {post.author.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{post.readingTime}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
}
