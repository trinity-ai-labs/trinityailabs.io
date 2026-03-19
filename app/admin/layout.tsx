"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Users, Mail, Shield } from "lucide-react";

const sidebarLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Invites", href: "/admin/invites", icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isPending || !session) return;
    fetch("/api/admin/me")
      .then((r) => {
        if (r.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/dashboard");
        }
      })
      .catch(() => {
        setIsAdmin(false);
        router.push("/dashboard");
      });
  }, [session, isPending, router]);

  if (isPending || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
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
          <Badge variant="secondary" className="ml-auto text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-border mt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
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
