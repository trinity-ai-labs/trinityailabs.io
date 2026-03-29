"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SetupHandlePage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [handleError, setHandleError] = useState("");
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handleTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // If user already has a handle, skip to dashboard
  useEffect(() => {
    fetch("/api/handle/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.handle) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  // Debounced availability check
  useEffect(() => {
    if (handleTimerRef.current) clearTimeout(handleTimerRef.current);
    const value = handle.toLowerCase().trim();
    if (value.length < 3) {
      setHandleAvailable(null);
      setHandleError(value.length > 0 ? "At least 3 characters" : "");
      return;
    }
    setCheckingHandle(true);
    handleTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/handle?handle=${encodeURIComponent(value)}`,
        );
        const data = await res.json();
        if (!res.ok) {
          setHandleError(data.error);
          setHandleAvailable(false);
        } else {
          setHandleAvailable(data.available);
          setHandleError(data.available ? "" : "Handle already taken");
        }
      } catch {
        setHandleError("Failed to check availability");
        setHandleAvailable(null);
      }
      setCheckingHandle(false);
    }, 400);
  }, [handle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to set handle");
        setSaving(false);
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("Failed to set handle");
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Pick a handle</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Choose a unique handle for your account. You can change it later in
        settings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="handle" className="block text-sm font-medium mb-1.5">
            Handle
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) =>
                setHandle(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder="your-handle"
              className="pl-7"
              minLength={3}
              maxLength={30}
              autoFocus
              required
            />
            {handle.length >= 3 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {checkingHandle ? "..." : handleAvailable ? "\u2713" : "\u2717"}
              </span>
            )}
          </div>
          {handleError && (
            <p className="text-xs text-destructive mt-1">{handleError}</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={saving || !handleAvailable || checkingHandle}
          className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
        >
          {saving ? "Setting up..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
