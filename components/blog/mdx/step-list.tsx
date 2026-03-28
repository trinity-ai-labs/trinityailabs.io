"use client";

import { Children } from "react";

export function Step({ children }: { children: React.ReactNode }) {
  return <div className="blog-step-content">{children}</div>;
}

export function StepList({ children }: { children: React.ReactNode }) {
  const steps = Children.toArray(children);

  return (
    <div className="my-8 space-y-6">
      {steps.map((child, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-gradient-to-b from-emerald-500/40 to-transparent mt-2" />
            )}
          </div>
          <div className="pt-1 pb-2 min-w-0 flex-1 [&>*:first-child]:mt-0">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
