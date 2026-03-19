"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Status = "loading" | "no-code" | "confirming" | "success" | "error";

function DesktopAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!code) {
      setStatus("no-code");
      return;
    }
    if (isPending) return;

    if (!session) {
      router.replace(
        `/login?callbackUrl=${encodeURIComponent(`/desktop?code=${code}`)}`
      );
      return;
    }

    setStatus("confirming");
  }, [code, session, isPending, router]);

  async function handleApprove() {
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/device/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to authorize");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Network error");
      setStatus("error");
    }
  }

  if (status === "loading" || isPending) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "no-code") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
        <p className="text-muted-foreground">No device code provided.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Authorized!</h1>
        <p className="text-muted-foreground">
          You can close this window and return to Trinity.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Authorization Failed</h1>
        <p className="text-sm text-destructive mb-4">{error}</p>
        <Button onClick={() => setStatus("confirming")} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Confirming state
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Authorize Trinity Desktop</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Sign in as{" "}
        <span className="font-medium text-foreground">
          {session?.user?.email}
        </span>{" "}
        on the Trinity desktop app?
      </p>
      <div className="space-y-3">
        <Button
          onClick={handleApprove}
          className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
        >
          Approve
        </Button>
        <p className="text-xs text-muted-foreground">
          Code: <code className="font-mono">{code}</code>
        </p>
      </div>
    </div>
  );
}

export default function DesktopAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <DesktopAuthContent />
    </Suspense>
  );
}
