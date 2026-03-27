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
  title: "Trinity AI Labs | Describe It. Ship It.",
  description:
    "Trinity builds your software while you sleep. AI agents that plan, code, review, and ship — with team collaboration, metrics, and reports. The IDE that actually integrates everything. Available for macOS & Linux.",
  keywords: [
    "AI",
    "IDE",
    "next-generation IDE",
    "development environment",
    "AI agents",
    "autonomous coding",
    "code generation",
    "parallel execution",
    "Tauri",
    "desktop app",
  ],
  openGraph: {
    title: "Trinity AI Labs | Describe It. Ship It.",
    description:
      "Trinity builds your software while you sleep. The IDE that actually integrates everything.",
    url: "https://trinityailabs.com",
    siteName: "Trinity AI Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity AI Labs | Describe It. Ship It.",
    description:
      "Trinity builds your software while you sleep. The IDE that actually integrates everything.",
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
