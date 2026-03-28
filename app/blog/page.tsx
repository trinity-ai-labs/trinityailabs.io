import { Suspense } from "react";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { FeaturedPost } from "@/components/blog/featured-post";
import { PostCard } from "@/components/blog/post-card";
import { CategoryFilter } from "@/components/blog/category-filter";

export const metadata = {
  title: "Blog",
  description:
    "Insights on AI-powered development, autonomous coding agents, and shipping software faster.",
};

function BlogContent({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const activeCategory = searchParams.category;

  const featured = allPosts.find((p) => p.featured);
  const filtered = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;
  // Don't show featured post again in the grid (unless filtering)
  const gridPosts = activeCategory
    ? filtered
    : filtered.filter((p) => p.slug !== featured?.slug);

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
        <p className="text-muted-foreground">
          We&apos;re working on our first articles. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {featured && !activeCategory && <FeaturedPost post={featured} />}

      {categories.length > 1 && <CategoryFilter categories={categories} />}

      {gridPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {gridPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          No articles in this category yet.
        </div>
      )}
    </>
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[2.5rem] font-bold tracking-tight mb-3">Blog</h1>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 mb-4" />
        <p className="text-lg text-muted-foreground max-w-2xl">
          Insights on AI-powered development, autonomous coding agents, and the
          future of shipping software.
        </p>
      </div>

      <Suspense>
        <BlogContent searchParams={params} />
      </Suspense>
    </div>
  );
}
