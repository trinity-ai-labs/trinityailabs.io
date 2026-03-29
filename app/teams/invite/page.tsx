"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState<
    "loading" | "ready" | "accepting" | "accepted" | "error"
  >("loading");
  const [error, setError] = useState("");
  const [teamInfo, setTeamInfo] = useState<{
    teamId: string;
    teamName: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No invite token provided.");
      return;
    }
    // We need the team ID from the invite. Fetch it by checking invites.
    // For now, just set ready — the accept endpoint validates the token.
    setStatus("ready");
  }, [token]);

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login, then come back
      router.push(`/login?callbackUrl=/teams/invite?token=${token}`);
    }
  }, [session, isPending, router, token]);

  async function handleAccept() {
    if (!token || !session) return;
    setStatus("accepting");

    // We need to find the team ID for this token. Try all user's teams first,
    // or accept against a generic endpoint. The accept endpoint validates the token
    // against a specific team, so we need the team_id.
    // Workaround: the email contains a link, and the backend can look up the token.
    // Let's add a lookup endpoint. For now, try to accept by scanning.
    try {
      // First, find which team this invite belongs to
      const lookupRes = await fetch(
        `/api/teams/invite/lookup?token=${encodeURIComponent(token)}`,
      );
      if (!lookupRes.ok) {
        const data = await lookupRes.json();
        setError(data.error ?? "Invalid invite");
        setStatus("error");
        return;
      }
      const { teamId, teamName } = await lookupRes.json();
      setTeamInfo({ teamId, teamName });

      const res = await fetch(`/api/teams/${teamId}/invite/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to accept invite");
        setStatus("error");
        return;
      }

      setStatus("accepted");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (isPending || (!session && status !== "error")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "accepted" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-emerald-500" />
              </div>
              <CardTitle>You&apos;re in!</CardTitle>
              <CardDescription>
                You&apos;ve joined{" "}
                <span className="font-medium text-foreground">
                  {teamInfo?.teamName ?? "the team"}
                </span>
                . Open the Trinity desktop app to start collaborating.
              </CardDescription>
            </>
          ) : status === "error" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Invite Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Team Invite</CardTitle>
              <CardDescription>
                You&apos;ve been invited to join a team on Trinity.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center">
          {status === "ready" && (
            <Button
              onClick={handleAccept}
              className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            >
              Accept Invite
            </Button>
          )}
          {status === "accepting" && (
            <Button disabled className="font-mono">
              Joining...
            </Button>
          )}
          {(status === "accepted" || status === "error") && (
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/teams")}
            >
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TeamInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
