import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM_ADDRESS = "Trinity AI Labs <info@trinityailabs.com>";

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch]!);
}

export async function sendVerificationEmail(to: string, url: string) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email - Trinity AI Labs",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Verify your email</h1>
        <p style="color: #666; margin-bottom: 24px;">
          Click the button below to verify your email address and activate your Trinity account.
        </p>
        <a href="${url}" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If you didn&apos;t create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendInviteEmail(to: string, inviteUrl: string) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "You're invited to Trinity AI Labs",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">You're invited!</h1>
        <p style="color: #666; margin-bottom: 24px;">
          You've been invited to join Trinity AI Labs. Click the button below to create your account.
        </p>
        <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Accept Invitation
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If you weren&apos;t expecting this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your password - Trinity AI Labs",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #666; margin-bottom: 24px;">
          Click the button below to set a new password for your Trinity account. This link expires in 1 hour.
        </p>
        <a href="${url}" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If you didn&apos;t request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendTeamInviteEmail(
  to: string,
  teamName: string,
  inviterName: string,
  acceptUrl: string,
) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Join ${teamName} on Trinity`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">You're invited to ${teamName}</h1>
        <p style="color: #666; margin-bottom: 24px;">
          ${inviterName} has invited you to join <strong>${teamName}</strong> on Trinity.
          Click the button below to accept.
        </p>
        <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Join Team
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If you weren&apos;t expecting this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendBugReportEmail(report: {
  id: string;
  title: string;
  description: string;
  userEmail: string;
  userName: string | null;
  appVersion: string | null;
  os: string | null;
}) {
  const adminEmail =
    process.env.BUG_REPORT_NOTIFY_EMAIL ?? "info@trinityailabs.com";
  const siteUrl = process.env.BETTER_AUTH_URL ?? "https://trinityailabs.com";

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: adminEmail,
    subject: `[Bug Report] ${report.title}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">New Bug Report</h1>
        <p style="color: #666; margin-bottom: 8px;"><strong>Title:</strong> ${escapeHtml(report.title)}</p>
        <p style="color: #666; margin-bottom: 8px;"><strong>Reporter:</strong> ${escapeHtml(report.userName ?? "Unknown")} (${escapeHtml(report.userEmail)})</p>
        ${report.appVersion ? `<p style="color: #666; margin-bottom: 8px;"><strong>App Version:</strong> ${escapeHtml(report.appVersion)}</p>` : ""}
        ${report.os ? `<p style="color: #666; margin-bottom: 8px;"><strong>OS:</strong> ${escapeHtml(report.os)}</p>` : ""}
        <p style="color: #666; margin-bottom: 24px;"><strong>Description:</strong><br/>${escapeHtml(report.description).replace(/\n/g, "<br/>")}</p>
        <a href="${siteUrl}/admin/bug-reports/${report.id}" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          View Bug Report
        </a>
      </div>
    `,
  });
}

export async function sendQuotaGraceEmail(
  to: string,
  name: string,
  usedGb: string,
  quotaGb: string,
  daysRemaining: number,
) {
  const isUrgent = daysRemaining <= 2;
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: isUrgent
      ? `Urgent: ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} until files are removed`
      : "You're over your storage quota",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">
          ${isUrgent ? "Action Required" : "Storage Quota Exceeded"}
        </h1>
        <p style="color: #666; margin-bottom: 16px;">
          Hi ${escapeHtml(name)}, you're using <strong>${escapeHtml(usedGb)}</strong> of your
          <strong>${escapeHtml(quotaGb)}</strong> storage quota.
        </p>
        <p style="color: ${isUrgent ? "#dc2626" : "#666"}; margin-bottom: 24px; font-weight: ${isUrgent ? "600" : "normal"};">
          You have ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} to free up space before files
          are automatically removed.
        </p>
        <p style="color: #666; margin-bottom: 16px;">To keep your files safe:</p>
        <ul style="color: #666; margin-bottom: 24px;">
          <li>Move projects to local storage (personal projects only)</li>
          <li>Use your own S3-compatible bucket</li>
          <li>Buy a storage pack ($5/mo for 10 GB)</li>
          <li>Delete files you no longer need</li>
        </ul>
        <a href="https://trinityailabs.com/dashboard/billing" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Manage Storage
        </a>
      </div>
    `,
  });
}

export async function sendQuotaPrunedEmail(
  to: string,
  name: string,
  fileCount: number,
  freedGb: string,
) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `${fileCount} file${fileCount === 1 ? "" : "s"} removed from your storage`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Files Automatically Removed</h1>
        <p style="color: #666; margin-bottom: 16px;">
          Hi ${escapeHtml(name)}, your storage quota was exceeded for more than 7 days.
          To bring your account back under the limit, <strong>${fileCount} file${fileCount === 1 ? "" : "s"}</strong>
          (${escapeHtml(freedGb)}) were automatically removed.
        </p>
        <p style="color: #666; margin-bottom: 24px;">
          Older and less-used files were prioritized for removal. To prevent this in the future,
          consider buying a storage pack or moving files to local/BYO storage.
        </p>
        <a href="https://trinityailabs.com/dashboard/billing" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Manage Storage
        </a>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Welcome to Trinity AI Labs",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Welcome, ${name}!</h1>
        <p style="color: #666; margin-bottom: 24px;">
          Your Trinity account is ready. Download the app and sign in to get started.
        </p>
        <a href="https://trinityailabs.com/dashboard" style="display: inline-block; background: linear-gradient(to right, #10b981, #06b6d4); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
          Go to Dashboard
        </a>
      </div>
    `,
  });
}
