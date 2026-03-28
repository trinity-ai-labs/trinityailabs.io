import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Trinity Blog",
    default: "Blog | Trinity AI Labs",
  },
  description:
    "Insights on AI-powered development, autonomous coding agents, and shipping software faster.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
