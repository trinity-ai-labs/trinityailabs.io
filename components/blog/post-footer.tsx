import Image from "next/image";
import { ShareButtons } from "./share-buttons";
import { RelatedPosts } from "./related-posts";
import type { BlogPost } from "@/lib/blog";

const BASE_URL = "https://trinityailabs.com";

export function PostFooter({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const postUrl = `${BASE_URL}/blog/${post.slug}`;

  return (
    <footer className="mt-12">
      {/* Divider + share */}
      <div className="flex items-center justify-between py-6 border-t border-border">
        <div className="flex items-center gap-3">
          {post.author.avatar && (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-sm">{post.author.name}</p>
            {post.author.role && (
              <p className="text-xs text-muted-foreground">
                {post.author.role}
              </p>
            )}
          </div>
        </div>
        <ShareButtons title={post.title} url={postUrl} />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-accent text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <RelatedPosts posts={relatedPosts} />
    </footer>
  );
}
