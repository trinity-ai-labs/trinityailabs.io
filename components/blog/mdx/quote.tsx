export function Quote({
  author,
  role,
  children,
}: {
  author?: string;
  role?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8 relative">
      <div className="border-l-3 border-emerald-500/40 bg-emerald-500/[0.04] rounded-r-xl py-5 px-6">
        <blockquote className="text-lg leading-relaxed text-[oklch(0.88_0_0)] italic m-0 [&>p]:m-0">
          {children}
        </blockquote>
      </div>
      {author && (
        <figcaption className="mt-3 flex items-center gap-2 text-sm text-muted-foreground pl-6">
          <span className="w-6 h-px bg-emerald-500/40" />
          <span className="font-medium text-foreground">{author}</span>
          {role && <span>, {role}</span>}
        </figcaption>
      )}
    </figure>
  );
}
