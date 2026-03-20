import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsNav } from "@/components/docs/nav";

export const metadata: Metadata = {
  title: {
    template: "%s | Trinity Docs",
    default: "Documentation | Trinity AI Labs",
  },
  description:
    "Learn how to use Trinity — from project setup and planning to execution, insights, and configuration.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DocsNav />
      <div className="flex-1 flex">
        <DocsSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
