"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [handle, setHandle] = useState("");
  const [handleError, setHandleError] = useState("");
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [handleSaving, setHandleSaving] = useState(false);
  const [handleMessage, setHandleMessage] = useState("");
  const [originalHandle, setOriginalHandle] = useState("");
  const handleTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState("");

  // Load current handle
  useEffect(() => {
    fetch("/api/handle/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.handle) {
          setHandle(data.handle);
          setOriginalHandle(data.handle);
        }
      })
      .catch(() => {});
  }, []);

  // Check handle availability with debounce
  useEffect(() => {
    if (handleTimerRef.current) clearTimeout(handleTimerRef.current);
    const value = handle.toLowerCase().trim();
    if (value === originalHandle) {
      setHandleAvailable(null);
      setHandleError("");
      return;
    }
    if (value.length < 3) {
      setHandleAvailable(null);
      setHandleError(value.length > 0 ? "At least 3 characters" : "");
      return;
    }
    setCheckingHandle(true);
    handleTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/handle?handle=${encodeURIComponent(value)}`
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
  }, [handle, originalHandle]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await authClient.updateUser({ name });

    setMessage(error ? error.message ?? "Update failed" : "Profile updated");
    setSaving(false);
  }

  async function handleUpdateHandle(e: React.FormEvent) {
    e.preventDefault();
    setHandleSaving(true);
    setHandleMessage("");

    try {
      const res = await fetch("/api/handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHandleMessage(data.error ?? "Failed to update handle");
      } else {
        setHandleMessage("Handle updated");
        setOriginalHandle(data.handle);
        setHandleAvailable(null);
      }
    } catch {
      setHandleMessage("Failed to update handle");
    }
    setHandleSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwSaving(true);
    setPwMessage("");

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    if (error) {
      setPwMessage(error.message ?? "Failed to change password");
    } else {
      setPwMessage("Password changed");
      setCurrentPassword("");
      setNewPassword("");
    }
    setPwSaving(false);
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    await authClient.deleteUser();
    window.location.href = "/";
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input value={session?.user.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed.
              </p>
            </div>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            <Button type="submit" disabled={saving} variant="outline">
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Handle</CardTitle>
          <CardDescription>
            Your unique handle for invites and identification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateHandle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Handle</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  @
                </span>
                <Input
                  value={handle}
                  onChange={(e) =>
                    setHandle(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  className="pl-7"
                  minLength={3}
                  maxLength={30}
                  required
                />
                {handle.length >= 3 && handle !== originalHandle && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    {checkingHandle
                      ? "..."
                      : handleAvailable
                        ? "\u2713"
                        : "\u2717"}
                  </span>
                )}
              </div>
              {handleError && (
                <p className="text-xs text-destructive mt-1">{handleError}</p>
              )}
            </div>
            {handleMessage && (
              <p className="text-sm text-muted-foreground">{handleMessage}</p>
            )}
            <Button
              type="submit"
              disabled={
                handleSaving ||
                handle === originalHandle ||
                checkingHandle ||
                handleAvailable === false
              }
              variant="outline"
            >
              {handleSaving ? "Saving..." : "Update Handle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {pwMessage && (
              <p className="text-sm text-muted-foreground">{pwMessage}</p>
            )}
            <Button type="submit" disabled={pwSaving} variant="outline">
              {pwSaving ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
