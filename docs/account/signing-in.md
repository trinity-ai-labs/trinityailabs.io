# Signing In

Trinity requires a trinityailabs.com account. When you first launch the app, you'll see the login screen.

## Device Code Flow

Trinity uses a device code flow for authentication — similar to how streaming apps sign in on TVs:

1. Click **Sign In** in the Trinity desktop app
2. A device code appears (e.g., `BE279D70`)
3. Click **Open in Browser** to go to trinityailabs.com/desktop
4. Log in on the website if needed
5. The code is automatically confirmed
6. Trinity detects the approval and signs you in

The device code expires after 10 minutes. If it expires, click **Cancel** and start again.

## Account Types

- **Self-paid** — you subscribe at $10/month directly
- **Team seat** — a team owner pays for your seat

Both get the same features. One subscription per person.

## Signing Out

Click your avatar (initials bubble) in the top-left corner of the sidebar, then click **Sign Out**.

## Session Persistence

Your login persists across app restarts. You won't need to sign in again unless:

- You explicitly sign out
- Your subscription expires and the refresh token is revoked

Trinity requires an internet connection — AI providers, git operations (push, PRs, merges), and cloud sync all need it.
