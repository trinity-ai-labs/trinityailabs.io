export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Trinity completely changed how I ship features. I describe what I want, go to bed, and wake up to PRs that actually work.",
      name: "Coming Soon",
      title: "Early Access User",
      initials: "EA",
    },
    {
      quote:
        "The agent pipeline is the real deal — it's not just generating code, it's reviewing and documenting it too. Way beyond autocomplete.",
      name: "Coming Soon",
      title: "Early Access User",
      initials: "EA",
    },
    {
      quote:
        "Parallel execution with 5 workers is wild. What used to take me a week of coding now ships overnight with better test coverage.",
      name: "Coming Soon",
      title: "Early Access User",
      initials: "EA",
    },
  ];

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What developers are saying</h2>
          <p className="text-muted-foreground">
            Placeholder — real testimonials coming after early access
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card/50 p-6 flex flex-col"
            >
              <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-400">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
