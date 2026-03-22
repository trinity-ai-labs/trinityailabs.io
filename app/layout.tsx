import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trinity AI Labs | Autonomous AI Development Orchestrator",
  description:
    "Describe what you want to build. Trinity plans it, orchestrates AI agents to write and review code in parallel, and ships PRs — autonomously. Available for macOS, Windows & Linux.",
  keywords: [
    "AI",
    "development",
    "autonomous",
    "coding",
    "orchestrator",
    "AI agents",
    "code generation",
    "parallel execution",
    "Tauri",
    "desktop app",
  ],
  openGraph: {
    title: "Trinity AI Labs | Build While You're AFK",
    description:
      "Autonomous AI development orchestrator. Plan, execute, review, and ship — while you sleep.",
    url: "https://trinityailabs.com",
    siteName: "Trinity AI Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity AI Labs | Build While You're AFK",
    description:
      "Autonomous AI development orchestrator. Plan, execute, review, and ship — while you sleep.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
