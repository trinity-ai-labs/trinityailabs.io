"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "loading" | "enter-code" | "confirming" | "success" | "error";

function DesktopAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get("code");

  const [code, setCode] = useState(codeFromUrl ?? "");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    // Not logged in — redirect to login, then come back
    if (!session) {
      const callback = codeFromUrl
        ? `/desktop?code=${codeFromUrl}`
        : "/desktop";
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`);
      return;
    }

    // Logged in with code in URL — go straight to confirm
    if (codeFromUrl) {
      setStatus("confirming");
    } else {
      // Logged in but no code — ask for it
      setStatus("enter-code");
    }
  }, [codeFromUrl, session, isPending, router]);

  function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) {
      setStatus("confirming");
    }
  }

  async function handleApprove() {
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/device/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
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

  if (status === "enter-code") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Authorize Trinity Desktop</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the code shown in the Trinity desktop app.
        </p>
        <form onSubmit={handleSubmitCode} className="space-y-4">
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter device code"
            className="text-center font-mono text-lg tracking-widest"
            maxLength={8}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!code.trim()}
            className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          >
            Continue
          </Button>
        </form>
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
