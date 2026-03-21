import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Trinity AI Labs",
  description:
    "How Trinity AI Labs collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">
            Last updated: March 21, 2026
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
            <section>
              <h2 className="text-xl font-semibold mt-0">1. Introduction</h2>
              <p>
                Trinity AI Labs (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
                operates the Trinity desktop application and the trinityailabs.com
                website (collectively, the &quot;Service&quot;). This Privacy
                Policy explains how we collect, use, store, and protect your
                information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium mt-4">
                2.1 Account Information
              </h3>
              <p>
                When you create an account, we collect your name, email address,
                and password (hashed). If you sign up via Google or GitHub OAuth,
                we receive your name, email, and profile picture from those
                providers. We do not receive or store your OAuth passwords.
              </p>

              <h3 className="text-lg font-medium mt-4">
                2.2 Subscription &amp; Billing
              </h3>
              <p>
                Payments are processed by Lemon Squeezy, our Merchant of Record.
                We do not collect or store credit card numbers or payment method
                details. Lemon Squeezy handles all payment processing, tax
                calculation, and VAT compliance. We receive subscription status,
                plan details, and transaction identifiers from Lemon Squeezy via
                webhooks.
              </p>

              <h3 className="text-lg font-medium mt-4">2.3 Project Data</h3>
              <p>
                Trinity stores your project data — including project
                configurations, PRDs, stories, roadmaps, knowledge base entries,
                comments, activity feeds, and execution history — in cloud
                databases (Turso) to enable sync across your devices and team
                collaboration. This data is associated with your account.
              </p>

              <h3 className="text-lg font-medium mt-4">
                2.4 Secrets &amp; API Keys
              </h3>
              <p>
                You may store API keys and secrets within Trinity for use in
                project execution. These are encrypted at rest using a per-database
                256-bit encryption key. Encryption keys are delivered to your
                desktop app over HTTPS. We do not access or use your stored secrets
                for any purpose other than delivering them to your authenticated
                devices.
              </p>

              <h3 className="text-lg font-medium mt-4">2.5 Device Information</h3>
              <p>
                The Trinity desktop app generates a stable, random device
                identifier on first launch. This is used for execution ownership
                (tracking which device is running which task) and presence
                indicators. We also collect a device name (e.g., &quot;Alex&apos;s
                MacBook&quot;) for display purposes.
              </p>

              <h3 className="text-lg font-medium mt-4">
                2.6 Usage &amp; Execution Data
              </h3>
              <p>
                We collect execution metrics including AI token usage, cost
                tracking, pipeline durations, and agent handoff data. This data
                powers the metrics dashboard and is visible to you and your team
                members. It is stored in your synced database, not on separate
                analytics infrastructure.
              </p>

              <h3 className="text-lg font-medium mt-4">2.7 Asset Files</h3>
              <p>
                If you use Trinity-managed asset storage, files you upload
                (wireframes, PDFs, fonts, images) are stored on Cloudflare R2. File
                metadata syncs across your devices via Turso. If you use
                bring-your-own storage (S3/R2/B2), files are stored in your own
                bucket — we only store metadata.
              </p>

              <h3 className="text-lg font-medium mt-4">2.8 Local-Only Data</h3>
              <p>
                Certain data never leaves your machine: filesystem paths, worktree
                locations, local process IDs, port allocations, and machine-specific
                settings. This data is stored in a local SQLite database on your
                device and is never transmitted to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Provide the Service</strong> — authenticate you, sync
                  your project data across devices, enable team collaboration, and
                  run the execution pipeline.
                </li>
                <li>
                  <strong>Process payments</strong> — manage your subscription
                  status via Lemon Squeezy.
                </li>
                <li>
                  <strong>Send transactional emails</strong> — account
                  verification, team invitations, and password resets via Resend.
                </li>
                <li>
                  <strong>Display metrics</strong> — show execution analytics, cost
                  tracking, and team activity within the app.
                </li>
                <li>
                  <strong>Maintain security</strong> — detect unauthorized access,
                  manage device authentication tokens, and enforce subscription
                  status.
                </li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information. We do not use your project
                data or code to train AI models. We do not serve advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Turso</strong> — cloud database hosting for account data
                  and synced project databases.
                </li>
                <li>
                  <strong>Lemon Squeezy</strong> — payment processing, subscription
                  management, tax/VAT compliance (Merchant of Record).
                </li>
                <li>
                  <strong>Resend</strong> — transactional email delivery.
                </li>
                <li>
                  <strong>Cloudflare R2</strong> — asset file storage (managed
                  tier).
                </li>
                <li>
                  <strong>Vercel</strong> — website hosting.
                </li>
                <li>
                  <strong>Google / GitHub</strong> — OAuth authentication providers
                  (only if you choose to sign in with these).
                </li>
              </ul>
              <p className="mt-3">
                Each service processes data in accordance with their own privacy
                policies. We share only the minimum data necessary for each service
                to function.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                5. AI &amp; Claude Code
              </h2>
              <p>
                Trinity orchestrates Claude Code (by Anthropic) as a subprocess on
                your local machine. Trinity does not proxy AI requests — Claude Code
                connects directly to Anthropic using your own Claude subscription
                or API key. Your code and prompts are sent from your device to
                Anthropic, not through our servers. Anthropic&apos;s privacy policy
                governs their handling of that data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Data Storage &amp; Security</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Synced databases are hosted on Turso with TLS encryption in
                  transit.
                </li>
                <li>
                  Secrets are encrypted at rest using AES-256 with per-database
                  keys.
                </li>
                <li>
                  Authentication tokens (JWTs) are stored in your operating
                  system&apos;s secure keyring on desktop.
                </li>
                <li>
                  Website sessions use secure, HTTP-only cookies.
                </li>
                <li>
                  Each team gets a physically isolated database — your team&apos;s
                  data is not co-mingled with other teams.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Data Retention</h2>
              <p>
                Your data is retained for as long as your account is active. If
                your subscription lapses, your data is preserved (read-only access)
                and is never deleted. Reactivating your subscription restores full
                access. If you request account deletion, we will delete your
                account data, personal sync database, and any team databases you
                own (after notifying team members). Deleted team databases are held
                for 30 days before permanent deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                8. Team Collaboration &amp; Shared Data
              </h2>
              <p>
                When you join a team, your name, email, handle, and avatar are
                cached in the team&apos;s database so team members can see who they
                are collaborating with, including offline. Activity feeds, comments,
                and execution status are visible to all team members. If you are
                removed from a team, your Turso access token is revoked and you can
                no longer access the team&apos;s data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Your Rights</h2>
              <p>You may:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access your personal data via the dashboard and desktop app.</li>
                <li>
                  Update or correct your profile information in your account
                  settings.
                </li>
                <li>
                  Export your project data from the desktop app (local database
                  files).
                </li>
                <li>Request deletion of your account and associated data.</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:hello@trinityailabs.io"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  hello@trinityailabs.io
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                10. Children&apos;s Privacy
              </h2>
              <p>
                Our Service is not directed at children under 16. We do not
                knowingly collect personal information from children. If we learn
                that we have collected data from a child under 16, we will delete
                it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify
                you of material changes by email or via a notice in the Service.
                Your continued use of the Service after changes take effect
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, contact us at{" "}
                <a
                  href="mailto:hello@trinityailabs.io"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  hello@trinityailabs.io
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
