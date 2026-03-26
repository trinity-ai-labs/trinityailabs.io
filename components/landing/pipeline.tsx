export function Pipeline() {
  const phases = [
    {
      name: "Analyst",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
      tasks: ["Read story requirements", "Analyze codebase context", "Create implementation plan", "Identify risks & dependencies"],
    },
    {
      name: "Implementer",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      tasks: ["Execute the implementation plan", "Write code across files", "Run tests & fix failures", "Handle Docker services"],
    },
    {
      name: "Auditor",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
      tasks: ["Full code review", "Check against requirements", "Generate fix stories if needed", "Verify quality standards"],
    },
    {
      name: "Documenter",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      tasks: ["Update documentation", "Write PR description", "Record learnings to vault", "Create checkpoint release"],
    },
  ];

  return (
    <section className="py-24 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Agent Pipeline</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every story passes through four specialized agents.
            Each one has a specific job, creating a review loop that catches what single-shot generation misses.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase, i) => (
            <div key={phase.name} className={`rounded-xl border ${phase.bg} p-5`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-mono text-xs ${phase.color}`}>Phase {i + 1}</span>
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${phase.color}`}>{phase.name}</h3>
              <ul className="space-y-2">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.color.replace("text-", "bg-")}`} />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Flow arrow */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground font-mono flex-wrap">
          <span>Story in</span>
          <span className="text-blue-400">→</span>
          <span className="text-blue-400">Analyst</span>
          <span>→</span>
          <span className="text-yellow-400">Implementer</span>
          <span>→</span>
          <span className="text-purple-400">Auditor</span>
          <span>→</span>
          <span className="text-emerald-400">Documenter</span>
          <span className="text-emerald-400">→</span>
          <span>PR shipped</span>
        </div>
      </div>
    </section>
  );
}
