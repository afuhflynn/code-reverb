/*
 * CodeReverb Email Templates (Open-Source SaaS Edition)
 * Uses inline styles for maximum compatibility with email clients.
 * Transparent, community-driven, and honest about monetization.
 */

const BRAND_COLOR = "#2563eb"; // Matches --primary vibe
const BG_COLOR = "#ffffff"; // Matches --background
const TEXT_COLOR = "#0f172a"; // Matches --foreground
const MUTED_COLOR = "#475569"; // Matches muted-foreground energy

const GITHUB_URL = "https://github.com/codereverb/codereverb";
const OSS_BADGE = "Open-Source SaaS • MIT Licensed";

interface BaseTemplateProps {
  previewText: string;
  children: string;
}

function getBaseTemplate({ previewText, children }: BaseTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${previewText}">
  <title>CodeReverb Notification</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: ${BG_COLOR}; color: ${TEXT_COLOR}; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background-color: ${BRAND_COLOR}; padding: 24px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: bold; text-decoration: none; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: ${MUTED_COLOR}; }
    .button { display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    h1 { font-size: 20px; margin-bottom: 16px; }
    p { margin-bottom: 16px; }
    .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-table td:last-child { text-align: right; font-weight: 600; }
    .alert { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .alert.success { background-color: #f0fdf4; border-color: #bbf7d0; }
  </style>
</head>
<body>
  <div style="padding: 40px 16px;">
    <div class="container">
      <div class="header">
        <a href="${
          process.env.NEXT_PUBLIC_BASE_URL
        }" class="logo">CodeReverb</a>
        <p style="margin-top: 8px; font-size: 12px; color: #e0e7ff;">${OSS_BADGE}</p>
      </div>
      <div class="content">
        ${children}
      </div>
      <div class="footer">
        <p>
          CodeReverb is a community-driven, open-source AI code review platform.
          <br />
          <a href="${GITHUB_URL}" style="color: ${MUTED_COLOR}; text-decoration: underline;">View source on GitHub</a>
        </p>
        <p>&copy; ${new Date().getFullYear()} CodeReverb. Built in public.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy">Privacy</a> •
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms">Terms</a> •
          <a href="${GITHUB_URL}/issues">Report an Issue</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// USER EMAILS
// ============================================================================

export function getWelcomeEmail(name: string): string {
  return getBaseTemplate({
    previewText: "Welcome to CodeReverb",
    children: `
      <h1>Welcome to CodeReverb, ${name} 🚀</h1>
      <p>
        CodeReverb is an <strong>open-source, AI-powered code review platform</strong>
        built transparently with the community.
      </p>
      <p>
        Everything we run is auditable. Everything we improve is public.
      </p>
      <ol>
        <li>Connect your GitHub repositories</li>
        <li>Create AI reviewer personas</li>
        <li>Receive automated pull request reviews</li>
      </ol>
      <p>
        <a href="${GITHUB_URL}" style="color: ${BRAND_COLOR}; font-weight: 600;">Explore the open-source code →</a>
      </p>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Get Started</a>
      </div>
    `,
  });
}

export function getEmailVerificationEmail(
  name: string,
  verificationUrl: string
): string {
  return getBaseTemplate({
    previewText: "Verify your email",
    children: `
      <h1>Verify Your Email</h1>
      <p>Hi ${name},</p>
      <p>
        CodeReverb is open-source and community-reviewed.
        Email verification helps protect shared infrastructure.
      </p>
      <div style="text-align:center;">
        <a href="${verificationUrl}" class="button">Verify Email</a>
      </div>
      <p style="font-size: 14px; color: ${MUTED_COLOR};">Link expires in 24 hours.</p>
    `,
  });
}

export function getPasswordResetEmail(name: string, resetUrl: string): string {
  return getBaseTemplate({
    previewText: "Reset your password",
    children: `
      <h1>Password Reset</h1>
      <p>Hi ${name},</p>
      <p>If you requested a password reset, use the link below.</p>
      <div style="text-align:center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: ${MUTED_COLOR};">Expires in 1 hour.</p>
    `,
  });
}

export function getLowCreditsEmail(
  name: string,
  creditsRemaining: number,
  upgradeUrl: string
): string {
  return getBaseTemplate({
    previewText: "Low credits alert",
    children: `
      <h1>Credits Running Low</h1>
      <p>Hi ${name},</p>
      <p>
        CodeReverb is open-source, but shared AI compute is not free.
        Credits keep the platform sustainable.
      </p>
      <div class="alert">
        <strong>${creditsRemaining}</strong> credits remaining
      </div>
      <p style="font-size:14px; color:${MUTED_COLOR};">
        Prefer full control? Self-host CodeReverb using the open-source repo.
      </p>
      <div style="text-align:center;">
        <a href="${upgradeUrl}" class="button">Top Up Credits</a>
        <br />
        <a href="${GITHUB_URL}#self-hosting" style="margin-top:12px; display:inline-block;">Self-Host Instead</a>
      </div>
    `,
  });
}

// ============================================================================
// ADMIN EMAILS
// ============================================================================

export function getSystemErrorAlertEmail(
  adminName: string,
  error: string,
  timestamp: string,
  details: string,
  adminUrl: string
): string {
  return getBaseTemplate({
    previewText: "System error alert",
    children: `
      <h1>System Error Alert</h1>
      <p>Hi ${adminName},</p>
      <div class="alert">
        <strong>Error:</strong> ${error}<br />
        <strong>Time:</strong> ${timestamp}<br />
        <strong>Details:</strong> ${details}
      </div>
      <p style="font-size:13px; color:${MUTED_COLOR};">
        Reminder: CodeReverb operates as an open-source SaaS.
        Incidents should be documented transparently.
      </p>
      <div style="text-align:center;">
        <a href="${adminUrl}" class="button">View Logs</a>
      </div>
    `,
  });
}

/**
<p>Your AI reviewer persona <strong>${personaName}</strong> is ready.</p>
<p>This persona will now participate in code reviews.</p>
<a href="${personaUrl}" class="button">Manage Personas</a>
`,
});
}


/**
* Organization & access control
*/
export function organizationInviteEmail(
  inviter: string,
  orgName: string,
  acceptUrl: string
) {
  return getBaseTemplate({
    previewText: `Invitation to join ${orgName} on CodeReverb`,
    children: `
<h1>You’re invited</h1>
<p><strong>${inviter}</strong> invited you to join <strong>${orgName}</strong>.</p>
<p>You’ll gain access to repositories, analytics, and shared AI personas.</p>
<a href="${acceptUrl}" class="button">Accept Invitation</a>
`,
  });
}

export function roleChangedEmail(
  orgName: string,
  newRole: string,
  orgUrl: string
) {
  return getBaseTemplate({
    previewText: `Your role in ${orgName} has changed`,
    children: `
<h1>Role updated</h1>
<p>Your role in <strong>${orgName}</strong> is now <strong>${newRole}</strong>.</p>
<a href="${orgUrl}" class="button">View Organization</a>
`,
  });
}

/**
 * Review & automation edge cases
 */
export function pullRequestSkippedEmail(
  prTitle: string,
  reason: string,
  settingsUrl: string
) {
  return getBaseTemplate({
    previewText: `Pull request skipped: ${prTitle}`,
    children: `
<h1>Pull request skipped</h1>
<p>The pull request <strong>${prTitle}</strong> was skipped.</p>
<div class="alert">
<p><strong>Reason</strong>: ${reason}</p>
</div>
<a href="${settingsUrl}" class="button">Adjust Review Rules</a>
`,
  });
}

export function webhookFailureEmail(repoName: string, settingsUrl: string) {
  return getBaseTemplate({
    previewText: `Action required: Webhook issue for ${repoName}`,
    children: `
<h1>Webhook issue detected</h1>
<p>We’re having trouble receiving events from <strong>${repoName}</strong>.</p>
<p>This usually means the webhook was removed or permissions changed.</p>
<a href="${settingsUrl}" class="button">Fix Webhook</a>
`,
  });
}

export function backgroundJobFailureEmail(
  jobName: string,
  repoName: string,
  logsUrl: string
) {
  return getBaseTemplate({
    previewText: `Background job failure: ${jobName}`,
    children: `
<h1>Background job failure</h1>
<p>A background job failed while processing <strong>${jobName}</strong>.</p>
<table class="info-table">
<tr>
<td>Repository</td>
<td>${repoName}</td>
</tr>
</table>
<a href="${logsUrl}" class="button">View Logs</a>
`,
  });
}

/**
 * Security & trust
 */
export function securityNoticeEmail(
  summary: string,
  recommendedAction: string,
  detailsUrl: string
) {
  return getBaseTemplate({
    previewText: "Important security notice from CodeReverb",
    children: `
<h1>Security notice</h1>
<div class="alert">
<p><strong>${summary}</strong></p>
</div>
<p>Recommended action: ${recommendedAction}</p>
<a href="${detailsUrl}" class="button">View Details</a>
`,
  });
}
