import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-xl font-bold mb-6">Related Articles</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border hover:border-emerald-500/30 transition-colors overflow-hidden"
          >
            {post.coverImage && (
              <div className="overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  width={400}
                  height={225}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <Badge variant="secondary" className="text-[10px] mb-2">
                {post.category}
              </Badge>
              <h3 className="font-semibold text-sm leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                {formatDate(post.date)} &middot; {post.readingTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
