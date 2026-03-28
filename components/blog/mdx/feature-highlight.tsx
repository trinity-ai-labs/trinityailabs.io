import {
  Zap,
  Shield,
  Code,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  code: Code,
  globe: Globe,
  sparkles: Sparkles,
};

export function FeatureHighlight({
  icon,
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icon ? iconMap[icon] : Sparkles;

  return (
    <div className="my-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
      <div className="flex items-center gap-2.5 mb-2">
        {Icon && <Icon className="w-5 h-5 text-emerald-400 shrink-0" />}
        <h4 className="font-semibold text-foreground m-0">{title}</h4>
      </div>
      <div className="text-sm text-[oklch(0.85_0_0)] leading-relaxed [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}
