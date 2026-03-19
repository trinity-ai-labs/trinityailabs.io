"use client";

import { useState } from "react";
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState("");

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await authClient.updateUser({ name });

    setMessage(error ? error.message ?? "Update failed" : "Profile updated");
    setSaving(false);
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
