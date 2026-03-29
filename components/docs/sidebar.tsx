"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_SECTIONS } from "@/lib/docs-structure";
import { Rocket, Settings, Brain, Play, BarChart3, Wrench } from "lucide-react";

const SECTION_ICONS: Record<string, React.ElementType> = {
  "getting-started": Rocket,
  "project-setup": Settings,
  planning: Brain,
  execution: Play,
  insights: BarChart3,
  configuration: Wrench,
};

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="py-8 px-5">
      {/* Docs home link */}
      <Link
        href="/docs"
        className={`block text-sm font-semibold mb-6 transition-colors ${
          pathname === "/docs"
            ? "text-emerald-400"
            : "text-foreground hover:text-emerald-400"
        }`}
      >
        Documentation
      </Link>

      <nav className="space-y-7">
        {DOC_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section.slug];
          const sectionActive = pathname?.startsWith(`/docs/${section.slug}`);

          return (
            <div key={section.slug}>
              <div className="flex items-center gap-2 mb-2.5">
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      sectionActive
                        ? "text-emerald-400"
                        : "text-muted-foreground/60"
                    }`}
                  />
                )}
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    sectionActive
                      ? "text-emerald-400/80"
                      : "text-muted-foreground/60"
                  }`}
                >
                  {section.name}
                </span>
              </div>
              <ul className="space-y-0.5 border-l border-border ml-[6px] pl-[14px]">
                {section.chapters.map((chapter) => {
                  const href = `/docs/${section.slug}/${chapter.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={chapter.slug}>
                      <Link
                        href={href}
                        className={`block py-1 text-[13px] transition-all ${
                          isActive
                            ? "text-emerald-400 font-medium translate-x-0.5"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {chapter.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function DocsSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-border overflow-y-auto sticky top-14 h-[calc(100vh-3.5rem)]">
      <SidebarContent />
    </aside>
  );
}

export function DocsSidebarMobile({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border overflow-y-auto pt-14">
        <SidebarContent />
      </aside>
    </>
  );
}
