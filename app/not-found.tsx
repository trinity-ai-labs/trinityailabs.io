import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold font-mono text-emerald-400 mb-4">
          404
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
