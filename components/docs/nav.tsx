"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DocsSidebarMobile } from "./sidebar";

export function DocsNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 h-14 border-b transition-colors ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border"
            : "bg-background border-border"
        }`}
      >
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Trinity"
                width={26}
                height={26}
                className="rounded-md"
              />
              <span className="font-mono font-bold text-base">trinity</span>
            </Link>

            <div className="hidden sm:flex items-center">
              <span className="text-border mx-3">/</span>
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileOpen && <DocsSidebarMobile onClose={() => setMobileOpen(false)} />}
    </>
  );
}
