"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CategoryFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function handleClick(category: string | null) {
    if (category) {
      router.push(`/blog?category=${encodeURIComponent(category)}`, {
        scroll: false,
      });
    } else {
      router.push("/blog", { scroll: false });
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8 scrollbar-none">
      <button
        onClick={() => handleClick(null)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !active
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
            : "bg-accent text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
              : "bg-accent text-muted-foreground hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
