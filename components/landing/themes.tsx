import Image from "next/image";
import { Palette } from "lucide-react";

const themes = [
  {
    name: "Light",
    description: "Clean and minimal",
    image: "/screenshots/theme-light.png",
  },
  {
    name: "Dark",
    description: "Easy on the eyes",
    image: "/screenshots/theme-dark.png",
  },
  {
    name: "Cyber Light",
    description: "Vibrant and expressive",
    image: "/screenshots/theme-cyber-light.png",
  },
  {
    name: "Cyber Dark",
    description: "Neon developer aesthetic",
    image: "/screenshots/theme-cyber-dark.png",
  },
];

export function Themes() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-mono text-emerald-400 uppercase tracking-wider">
              Personalize
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Four themes. Your style.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Switch between Light, Dark, and two Cyber themes designed for developers
            who want their tools to look as good as they work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="group rounded-xl border border-border bg-card/50 overflow-hidden hover:border-emerald-500/30 transition-colors"
            >
              <div className="overflow-hidden">
                <Image
                  src={theme.image}
                  alt={`Trinity ${theme.name} theme`}
                  width={720}
                  height={450}
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-sm text-muted-foreground">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
