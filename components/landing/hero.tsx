"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { PlatformDownload } from "./platform-download";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card/50 backdrop-blur">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              Now available for macOS &amp; Linux
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Describe it.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Ship it.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Trinity builds your software while you sleep.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <PlatformDownload />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-mono text-muted-foreground hover:text-foreground"
            >
              <a href="#how-it-works">
                See How It Works
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Product screenshot */}
          <div className="max-w-4xl mx-auto rounded-xl border border-border overflow-hidden shadow-2xl shadow-emerald-500/10">
            <Image
              src="/screenshots/dashboard.png"
              alt="Trinity Dashboard — project overview with story progress, phase tracking, and execution status"
              width={1440}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
