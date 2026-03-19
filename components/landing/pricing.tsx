import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const features = [
  "Cloud sync via Turso",
  "Unlimited projects",
  "Full feature set",
  "Priority support",
  "Metrics & reports",
  "PDF reports",
  "All AI providers",
  "Parallel execution",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One plan. Everything included. No tiers to compare.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 p-8">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Everything you need to ship with Trinity
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$10</span>
                <span className="text-muted-foreground">/seat/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              size="lg"
            >
              <a href="/signup">Get Started</a>
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Bring your own AI API keys (Anthropic, DeepSeek, or Ollama). Trinity
          doesn&apos;t charge for AI usage — you pay your provider directly.
        </p>
      </div>
    </section>
  );
}
