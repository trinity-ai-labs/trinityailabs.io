"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/lib/docs-structure";

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pr-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-4">
        On this page
      </div>
      <ul className="space-y-1 border-l border-border pl-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-[13px] py-0.5 transition-all leading-snug ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-emerald-400 font-medium"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
