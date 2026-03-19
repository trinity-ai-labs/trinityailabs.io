import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM_ADDRESS = "Trinity AI Labs <info@trinityailabs.com>";

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
