"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, LayoutDashboard, Shield } from "lucide-react";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/admin/me")
      .then((r) => {
        if (r.ok) setIsAdmin(true);
      })
      .catch(() => {});
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/app-icon.png"
              alt="Trinity"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-mono font-bold">trinity</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin
            </a>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-sm">{session.user.name}</span>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
