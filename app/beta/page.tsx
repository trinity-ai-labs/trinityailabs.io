"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Loader2, Trophy } from "lucide-react";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export default function BetaSignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/beta/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const data = await res.json();
      setResult({ ok: res.ok || data.ok, message: data.message ?? data.error });
    } catch {
      setResult({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Nav />

      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto px-6">
          <div className="text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card/50 backdrop-blur">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                Limited beta access
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              Help us build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Trinity
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
              Join the beta program. Get early access, report bugs, and climb
              the leaderboard. Top testers earn rewards.
            </p>

            {result ? (
              <div className="max-w-md mx-auto">
                <div className="flex items-center gap-3 p-6 rounded-xl border border-border bg-card/80 backdrop-blur">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <p className="text-sm text-left">{result.message}</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-4"
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {submitting ? "Submitting..." : "Apply for Beta Access"}
                </Button>
              </form>
            )}

            {/* Leaderboard link */}
            <div className="mt-12">
              <Link
                href="/beta/leaderboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Trophy className="w-4 h-4" />
                View the bug hunter leaderboard
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            What beta testers get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free access",
                description:
                  "Full complimentary access to Trinity while you're in the beta program.",
              },
              {
                title: "Direct impact",
                description:
                  "Report bugs, suggest features, and shape the product before launch.",
              },
              {
                title: "Leaderboard",
                description:
                  "Top bug reporters are recognized on the public leaderboard.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-border bg-card/50"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
