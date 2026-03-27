import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Trinity"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-mono font-bold text-lg">trinity</span>
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        Trinity AI Labs
      </footer>
    </div>
  );
}
