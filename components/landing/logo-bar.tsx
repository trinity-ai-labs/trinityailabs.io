import { Zap } from "lucide-react";

export function LogoBar() {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">Built with Tauri 2</span>
            </div>
            <span className="hidden sm:inline text-border">|</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">
                Powered by Claude, DeepSeek &amp; Ollama
              </span>
            </div>
            <span className="hidden sm:inline text-border">|</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">macOS · Linux</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
