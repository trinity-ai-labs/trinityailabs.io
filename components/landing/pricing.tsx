import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For trying Trinity on personal projects",
    cta: "Download",
    ctaHref: "#downloads",
    ctaVariant: "outline" as const,
    features: [
      { text: "Local execution only", included: true },
      { text: "1 project", included: true },
      { text: "Solo use", included: true },
      { text: "Community support", included: true },
      { text: "All AI providers", included: true },
      { text: "Cloud sync", included: false },
      { text: "Unlimited projects", included: false },
      { text: "Team features", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$10",
    period: "/mo",
    description: "For developers shipping real projects",
    cta: "Get Started",
    ctaHref: "#downloads",
    ctaVariant: "default" as const,
    highlight: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Cloud sync via Turso", included: true },
      { text: "Unlimited projects", included: true },
      { text: "Full feature set", included: true },
      { text: "Priority support", included: true },
      { text: "Metrics & reports", included: true },
      { text: "PDF reports", included: true },
      { text: "Team features", included: false },
    ],
  },
  {
    name: "Team",
    price: "$10",
    period: "/seat/mo",
    description: "For teams building together",
    cta: "Contact Us",
    ctaHref: "mailto:hello@trinityailabs.io",
    ctaVariant: "outline" as const,
    comingSoon: true,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Shared planning", included: true },
      { text: "Execution visibility", included: true },
      { text: "Comments & activity feed", included: true },
      { text: "Team secrets management", included: true },
      { text: "Role-based permissions", included: true },
      { text: "Collaborative execution", included: true },
      { text: "Cloud execution (add-on)", included: true },
    ],
  },
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
            Start free. Upgrade when you need cloud sync and unlimited projects.
            Bring your own AI API keys.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 flex flex-col relative ${
                tier.highlight
                  ? "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
                  : "border-border bg-card/50"
              }`}
            >
              {tier.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-mono text-xs">
                  Most Popular
                </Badge>
              )}
              {tier.comingSoon && (
                <Badge variant="outline" className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-xs">
                  Coming Soon
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/40"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={tier.ctaVariant}
                className={`w-full font-mono ${
                  tier.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    : ""
                }`}
              >
                <a href={tier.ctaHref}>{tier.cta}</a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans require your own AI API keys (Anthropic, DeepSeek, or Ollama).
          Trinity doesn&apos;t charge for AI usage — you pay your provider directly.
        </p>
      </div>
    </section>
  );
}
