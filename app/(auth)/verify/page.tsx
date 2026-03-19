"use client";

import { use, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`/api/auth/verify-email?token=${token}`);
    return res.ok;
  } catch {
    return false;
  }
}

function VerifyResult({ promise }: { promise: Promise<boolean> }) {
  const ok = use(promise);

  if (!ok) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The verification link is invalid or has expired.
        </p>
        <Button asChild variant="outline">
          <a href="/signup">Try again</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-6 h-6 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Email verified!</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your account is ready. Sign in to get started.
      </p>
      <Button
        asChild
        className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
      >
        <a href="/login">Sign In</a>
      </Button>
    </div>
  );
}

function VerifyInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [promise] = useState(() => verifyToken(token));

  return (
    <Suspense
      fallback={
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your email.
          </p>
        </div>
      }
    >
      <VerifyResult promise={promise} />
    </Suspense>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
