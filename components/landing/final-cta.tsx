import { PlatformDownload } from "./platform-download";

export function FinalCTA() {
  return (
    <section id="downloads" className="py-24 border-t border-border relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-cyan-500/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to build while you&apos;re AFK?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
          Download Trinity and ship your first feature tonight.
          Free plan, no credit card required.
        </p>
        <div className="flex justify-center">
          <PlatformDownload size="lg" />
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Available for macOS and Linux
        </p>
      </div>
    </section>
  );
}
