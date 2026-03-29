"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users, Plus, Mail, Trash2, Crown, Copy, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StorageBar, formatBytes } from "@/components/dashboard/storage-bar";

type Team = {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
  role: string;
  member_count: number;
};

type Member = {
  user_id: string;
  name: string;
  email: string;
  role: string;
  joined_at: string;
};

type Invite = {
  id: string;
  email: string;
  status: string;
  created_at: string;
};

type TeamDetail = {
  team: { id: string; name: string; slug: string; owner_id: string };
  members: Member[];
  pendingInvites: Invite[];
  currentUserRole: string;
};

type TeamStorage = {
  id: string;
  storageUsedBytes: number;
  storageQuotaBytes: number;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [teamStorage, setTeamStorage] = useState<TeamStorage[]>([]);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(false);

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/teams");
    if (res.ok) {
      const data = await res.json();
      setTeams(data.teams);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchTeams();
      try {
        const r = await fetch("/api/dashboard/usage");
        if (r.ok) {
          const data = await r.json();
          if (data?.teams) {
            setTeamStorage(
              data.teams.map(
                (t: {
                  id: string;
                  storageUsedBytes: number;
                  storageQuotaBytes: number;
                }) => ({
                  id: t.id,
                  storageUsedBytes: t.storageUsedBytes,
                  storageQuotaBytes: t.storageQuotaBytes,
                }),
              ),
            );
          }
        }
      } catch {
        // Storage data is non-critical
      }
    };
    loadData();
  }, [fetchTeams]);

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setError("");
    setCreating(true);

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTeamName.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create team");
      setCreating(false);
      return;
    }

    setNewTeamName("");
    setCreating(false);
    await fetchTeams();
  }

  async function selectTeam(teamId: string) {
    const res = await fetch(`/api/teams/${teamId}`);
    if (res.ok) {
      setSelectedTeam(await res.json());
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeam || !inviteEmail.trim()) return;
    setError("");
    setInviting(true);

    const res = await fetch(`/api/teams/${selectedTeam.team.id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send invite");
      setInviting(false);
      return;
    }

    setInviteEmail("");
    setInviting(false);
    await selectTeam(selectedTeam.team.id);
  }

  async function handleRemoveMember(userId: string) {
    if (!selectedTeam) return;
    const res = await fetch(
      `/api/teams/${selectedTeam.team.id}/members/${userId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setRemovingMemberId(null);
      await selectTeam(selectedTeam.team.id);
      await fetchTeams();
    }
  }

  async function handleDeleteTeam() {
    if (!selectedTeam) return;
    const res = await fetch(`/api/teams/${selectedTeam.team.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setConfirmDeleteTeam(false);
      setSelectedTeam(null);
      await fetchTeams();
    }
  }

  async function handleCopySlug() {
    if (!selectedTeam) return;
    await navigator.clipboard.writeText(selectedTeam.team.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted/50 animate-pulse rounded-lg border" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create and manage your teams.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Create team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a Team</CardTitle>
          <CardDescription>
            Teams share a database for collaborative project work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="flex gap-3">
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" disabled={creating || !newTeamName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              {creating ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Team list */}
      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => selectTeam(team.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors hover:bg-accent ${
                  selectedTeam?.team.id === team.id
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                    {team.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.member_count} member
                      {team.member_count !== 1 ? "s" : ""}
                      {(() => {
                        const ts = teamStorage.find((s) => s.id === team.id);
                        return ts
                          ? ` · ${formatBytes(ts.storageUsedBytes)} / ${formatBytes(ts.storageQuotaBytes)}`
                          : "";
                      })()}
                    </p>
                  </div>
                </div>
                {team.role === "owner" && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Team detail */}
      {selectedTeam && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {selectedTeam.team.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <span className="font-mono text-xs">
                      {selectedTeam.team.slug}
                    </span>
                    <button
                      onClick={handleCopySlug}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </CardDescription>
                </div>
                {selectedTeam.currentUserRole === "owner" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDeleteTeam(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members
              </h3>
              <div className="space-y-2">
                {selectedTeam.members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border"
                  >
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role === "owner" ? (
                        <span className="text-xs text-amber-500 font-medium">
                          Owner
                        </span>
                      ) : (
                        <>
                          <span className="text-xs text-muted-foreground">
                            Member
                          </span>
                          {selectedTeam.currentUserRole === "owner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setRemovingMemberId(member.user_id)
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending invites */}
              {selectedTeam.pendingInvites.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    Pending Invites
                  </h3>
                  {selectedTeam.pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-border"
                    >
                      <span className="text-sm text-muted-foreground">
                        {invite.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Team storage */}
              {(() => {
                const ts = teamStorage.find(
                  (s) => s.id === selectedTeam.team.id,
                );
                return ts ? (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Storage</h3>
                    <StorageBar
                      usedBytes={ts.storageUsedBytes}
                      quotaBytes={ts.storageQuotaBytes}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedTeam.members.length} seat
                      {selectedTeam.members.length !== 1 ? "s" : ""} × 5 GB
                    </p>
                  </div>
                ) : null;
              })()}

              {/* Invite form */}
              {selectedTeam.currentUserRole === "owner" && (
                <form onSubmit={handleInvite} className="mt-4 flex gap-3">
                  <Input
                    type="email"
                    placeholder="Invite by email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={inviting || !inviteEmail.trim()}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {inviting ? "Sending..." : "Invite"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Remove member confirmation */}
      <AlertDialog
        open={!!removingMemberId}
        onOpenChange={(open) => !open && setRemovingMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This person will lose access to all team projects and data. They
              can be re-invited later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (removingMemberId) handleRemoveMember(removingMemberId);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete team confirmation */}
      <AlertDialog
        open={confirmDeleteTeam}
        onOpenChange={setConfirmDeleteTeam}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team and all its data. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteTeam}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
