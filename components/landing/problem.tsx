export function Problem() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          Your &ldquo;IDE&rdquo; is just a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            text editor.
          </span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Cursor for code. Linear for tasks. GitHub for PRs. Notion for docs.
          Spreadsheets for metrics. Five tools. You&apos;re the glue.
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          IDE stands for <span className="text-foreground font-semibold">Integrated Development Environment</span>.
          It&apos;s time it lived up to its name.
        </p>

        {/* Pipeline visual */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
          {[
            { label: "Planning", desc: "PRDs & stories" },
            { label: "Execution", desc: "4-agent pipeline" },
            { label: "Review", desc: "Quality gates" },
            { label: "Knowledge", desc: "Compound learning" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold mb-2">
                  {i + 1}
                </div>
                <span className="text-sm font-semibold">{step.label}</span>
                <span className="text-xs text-muted-foreground">{step.desc}</span>
              </div>
              {i < 3 && (
                <div className="hidden sm:block w-8 h-px bg-gradient-to-r from-emerald-500/50 to-cyan-500/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
