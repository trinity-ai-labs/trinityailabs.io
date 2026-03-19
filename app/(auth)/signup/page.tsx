"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignUpForm() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteToken) return;
    fetch(`/api/admin/invites/accept?token=${encodeURIComponent(inviteToken)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.email) setInviteEmail(data.email);
      })
      .catch(() => null);
  }, [inviteToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      name,
      email: inviteEmail ?? email,
      password,
    });

    if (error) {
      setError(error.message ?? "Sign up failed");
      setLoading(false);
      return;
    }

    if (inviteToken && data?.user?.id) {
      await fetch("/api/admin/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inviteToken, userId: data.user.id }),
      }).catch(() => {});
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to{" "}
          <span className="text-foreground font-medium">
            {inviteEmail ?? email}
          </span>
          . Click the link to activate your account.
        </p>
        <a
          href="/login"
          className="inline-block mt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create an account</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {inviteToken
          ? "You've been invited to Trinity AI Labs."
          : "Get started with Trinity AI Labs."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={inviteEmail ?? email}
            onChange={(e) => {
              if (!inviteEmail) setEmail(e.target.value);
            }}
            placeholder="you@example.com"
            readOnly={!!inviteEmail}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-foreground hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
