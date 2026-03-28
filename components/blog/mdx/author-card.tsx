import Image from "next/image";

export function AuthorCard({
  name,
  avatar,
  role,
  bio,
}: {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}) {
  return (
    <div className="my-6 flex items-start gap-4 rounded-xl border border-[oklch(1_0_0/8%)] hover:border-emerald-500/20 transition-colors p-5 bg-[oklch(1_0_0/2%)]">
      {avatar && (
        <Image
          src={avatar}
          alt={name}
          width={48}
          height={48}
          className="rounded-full shrink-0"
        />
      )}
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{name}</span>
          {role && (
            <span className="text-xs text-muted-foreground">{role}</span>
          )}
        </div>
        {bio && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}
