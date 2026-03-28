const icons: Record<string, string> = {
  tip: "💡",
  note: "ℹ️",
  important: "⚡",
  warning: "⚠️",
};

export function Callout({
  type = "note",
  children,
}: {
  type?: "tip" | "note" | "important" | "warning";
  children: React.ReactNode;
}) {
  return (
    <div className={`docs-callout docs-callout-${type}`}>
      <div className="docs-callout-label">
        <span>{icons[type]}</span>
        {type}
      </div>
      <div className="docs-callout-content">{children}</div>
    </div>
  );
}
