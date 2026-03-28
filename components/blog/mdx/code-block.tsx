"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  children,
  filename,
  ...props
}: React.ComponentPropsWithoutRef<"pre"> & { filename?: string }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group">
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-[oklch(0.12_0.005_260)] border border-b-0 border-[oklch(1_0_0/8%)] rounded-t-[0.625rem] font-mono">
          {filename}
        </div>
      )}
      <pre
        ref={preRef}
        {...props}
        className={`${props.className ?? ""} ${filename ? "!rounded-t-none !mt-0" : ""}`}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-[oklch(1_0_0/5%)] border border-[oklch(1_0_0/10%)] text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
