"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Trinity"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-mono font-bold text-lg">trinity</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="w-8 h-8" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <a
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </a>
                    <button
                      onClick={async () => {
                        await authClient.signOut();
                        setUserMenuOpen(false);
                        router.push("/");
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" className="font-mono">
                <a href="/login">Sign In</a>
              </Button>
              <Button
                asChild
                className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                <a href="#downloads">Download</a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {isPending ? null : session ? (
            <>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4" />
                Dashboard
              </a>
              <Button
                variant="outline"
                className="w-full font-mono"
                onClick={async () => {
                  await authClient.signOut();
                  setMobileOpen(false);
                  router.push("/");
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block text-sm text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </a>
              <Button
                asChild
                className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                <a href="#downloads">Download</a>
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
