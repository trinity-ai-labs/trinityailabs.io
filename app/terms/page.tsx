import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Trinity AI Labs",
  description:
    "Terms and conditions for using Trinity, the next-generation IDE.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">
            Last updated: March 22, 2026
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
            <section>
              <h2 className="text-xl font-semibold mt-0">1. Agreement</h2>
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your use of
                the Trinity desktop application and trinityailabs.com website
                (collectively, the &quot;Service&quot;) operated by Trinity AI
                Labs (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By
                creating an account or using the Service, you agree to these
                Terms. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. The Service</h2>
              <p>
                Trinity is a next-generation Integrated Development Environment.
                It plans software projects, coordinates AI agents to write and
                review code, and manages the full development lifecycle. The
                Service includes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The Trinity desktop application (macOS, Linux).</li>
                <li>
                  Cloud sync for project data across devices and team members.
                </li>
                <li>
                  The trinityailabs.com website for account management, billing,
                  and documentation.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Accounts</h2>
              <p>
                You must create an account to use the Service. You are
                responsible for maintaining the security of your account
                credentials. You must provide accurate information and keep it
                up to date. You must be at least 16 years old to create an
                account. One account per person — do not create multiple
                accounts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                4. Subscription &amp; Billing
              </h2>

              <h3 className="text-lg font-medium mt-4">4.1 Pricing</h3>
              <p>
                The Service is offered at{" "}
                <strong>$10 per seat per month</strong>. Every subscription
                includes the full feature set — there are no feature tiers or
                gated capabilities. Pricing may change with reasonable notice.
              </p>

              <h3 className="text-lg font-medium mt-4">4.2 Payment</h3>
              <p>
                Payments are processed by Lemon Squeezy, our Merchant of Record.
                Lemon Squeezy handles billing, invoicing, tax/VAT calculation,
                and refunds. By subscribing, you also agree to Lemon
                Squeezy&apos;s terms of service.
              </p>

              <h3 className="text-lg font-medium mt-4">4.3 Team Seats</h3>
              <p>
                Team owners may purchase additional seats for team members at
                $10 per seat per month. Team-paid members receive full access
                covered by the owner&apos;s subscription. Members may also bring
                their own subscription. A person never needs more than one
                subscription.
              </p>

              <h3 className="text-lg font-medium mt-4">
                4.4 Subscription Lapse
              </h3>
              <p>
                If your subscription becomes inactive, you retain read-only
                access to your data. Execution and writes are blocked. Cloud
                sync is paused. Your data is never deleted due to subscription
                lapse — reactivating restores full access. For team-paid
                members, if the team owner&apos;s subscription lapses, all
                team-paid seats lose write access. Self-paid members on the same
                team are unaffected.
              </p>

              <h3 className="text-lg font-medium mt-4">4.5 Refunds</h3>
              <p>
                You may cancel your subscription at any time. Cancellation takes
                effect at the end of your current billing period — you retain
                full access until then. We do not issue refunds for partial
                billing periods. Payments are processed by Lemon Squeezy, our
                Merchant of Record, who may issue refunds at their discretion
                within 60 days of purchase to resolve disputes. If you believe
                you were charged in error, contact us at{" "}
                <a
                  href="mailto:info@trinityailabs.com"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  info@trinityailabs.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                5. Referral &amp; Affiliate Links
              </h2>
              <p>
                The Service may contain referral or affiliate links to
                third-party products and services. These links are clearly
                identified within the Service. If you click a referral link and
                make a purchase or create an account, Trinity AI Labs may
                receive a referral commission at no additional cost to you. The
                presence of a referral link does not constitute an endorsement
                or guarantee of the third-party product. We do not prioritize
                recommendations based on commission rates — referral links are
                only included for products relevant to the Trinity workflow.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                6. Claude Code Requirement
              </h2>
              <p>
                Trinity requires Claude Code (by Anthropic) to be installed on
                your machine, along with a valid Claude subscription or
                Anthropic API key. Trinity does not provide AI compute — it
                orchestrates Claude Code as a local subprocess. You are
                responsible for your own Claude subscription and any associated
                costs. Your use of Claude Code is governed by Anthropic&apos;s
                terms of service and acceptable use policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Your Data</h2>

              <h3 className="text-lg font-medium mt-4">7.1 Ownership</h3>
              <p>
                You retain all rights to your code, project data, and content.
                We do not claim ownership of any code generated through the
                Service. We do not use your code or project data to train AI
                models.
              </p>

              <h3 className="text-lg font-medium mt-4">7.2 Cloud Sync</h3>
              <p>
                Project data is synced via cloud databases (Turso) to enable
                multi-device and team access. You grant us a limited license to
                store, transmit, and display your project data solely for the
                purpose of providing the Service.
              </p>

              <h3 className="text-lg font-medium mt-4">7.3 Secrets</h3>
              <p>
                API keys and secrets you store in Trinity are encrypted at rest.
                You are responsible for the security and rotation of your own
                secrets. When a team member is removed, their database access is
                revoked, but previously-accessed secret values should be rotated
                externally if you no longer trust that person.
              </p>

              <h3 className="text-lg font-medium mt-4">7.4 Asset Storage</h3>
              <p>
                If you use Trinity-managed storage, uploaded assets are stored
                on Cloudflare R2. Per-file limit: 50MB. Per-project limit: 1GB.
                Per-user limit: 5GB. Allowed types: images, PDFs, fonts,
                documents, SVGs. We reserve the right to remove content that
                violates these limits or our acceptable use policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Teams</h2>

              <h3 className="text-lg font-medium mt-4">8.1 Team Creation</h3>
              <p>
                Any subscriber can create teams. The creator is the team owner.
                Teams are free to create — you pay only for seats.
              </p>

              <h3 className="text-lg font-medium mt-4">8.2 Roles</h3>
              <p>
                Teams have two roles: <strong>Owner</strong> and{" "}
                <strong>Member</strong>. Owners have full control over team
                settings, members, secrets, billing, and checkpoint approvals.
                Members can edit projects, start execution, and respond to story
                gates. See our documentation for the full permissions matrix.
              </p>

              <h3 className="text-lg font-medium mt-4">8.3 Data Isolation</h3>
              <p>
                Each team has a physically isolated database. Your team&apos;s
                project data is not accessible to other teams or users outside
                your team.
              </p>

              <h3 className="text-lg font-medium mt-4">8.4 Member Removal</h3>
              <p>
                When a member is removed from a team, their database access
                token is immediately revoked. Any in-progress execution jobs by
                the removed member will fail. The removed member can no longer
                access the team&apos;s data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Use the Service to generate malicious software, malware, or
                  code intended to cause harm.
                </li>
                <li>
                  Attempt to gain unauthorized access to other users&apos;
                  accounts, data, or databases.
                </li>
                <li>
                  Reverse-engineer, decompile, or disassemble the Service beyond
                  what is permitted by law.
                </li>
                <li>
                  Use the Service in violation of any applicable law or
                  regulation.
                </li>
                <li>
                  Resell, sublicense, or redistribute the Service without our
                  written permission.
                </li>
                <li>
                  Circumvent subscription checks, offline grace periods, or
                  other access controls.
                </li>
                <li>Store illegal content in Trinity-managed asset storage.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                10. Disclaimers &amp; Limitations
              </h2>

              <h3 className="text-lg font-medium mt-4">
                10.1 AI-Generated Code
              </h3>
              <p>
                Code generated through the Service is produced by AI (Claude
                Code). While Trinity orchestrates quality checks and review
                pipelines, we do not guarantee that generated code is free of
                bugs, security vulnerabilities, or errors. You are responsible
                for reviewing, testing, and validating all code before deploying
                it to production.
              </p>

              <h3 className="text-lg font-medium mt-4">
                10.2 Service Availability
              </h3>
              <p>
                We aim to provide reliable service but do not guarantee 100%
                uptime. The desktop app works offline with local data — cloud
                sync requires an internet connection. We are not liable for
                interruptions caused by Turso, Lemon Squeezy, Anthropic, or
                other third-party service outages.
              </p>

              <h3 className="text-lg font-medium mt-4">
                10.3 Limitation of Liability
              </h3>
              <p>
                To the maximum extent permitted by law, Trinity AI Labs shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of the
                Service. Our total liability is limited to the amount you paid
                us in the 12 months preceding the claim.
              </p>

              <h3 className="text-lg font-medium mt-4">10.4 No Warranty</h3>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, whether express
                or implied, including but not limited to merchantability,
                fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Termination</h2>
              <p>
                You may cancel your subscription at any time through Lemon
                Squeezy&apos;s customer portal. We may terminate or suspend your
                account if you violate these Terms. Upon termination, your data
                is preserved for 30 days (read-only) before permanent deletion,
                unless you request immediate deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you
                of material changes by email or via a notice in the Service.
                Continued use after changes take effect constitutes acceptance.
                If you disagree with updated Terms, you may cancel your
                subscription.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">13. Governing Law</h2>
              <p>
                These Terms are governed by applicable law. Any disputes arising
                from these Terms or the Service will be resolved through
                good-faith negotiation first. If negotiation fails, disputes
                will be resolved through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">14. Contact</h2>
              <p>
                Questions about these Terms? Contact us at{" "}
                <a
                  href="mailto:info@trinityailabs.com"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  info@trinityailabs.com
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
