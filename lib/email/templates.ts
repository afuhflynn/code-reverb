/**
 * CodeReverb Email Templates
 * Uses inline styles for maximum compatibility with email clients.
 * Adapted from platform theme colors for consistent branding.
 */

const BRAND_COLOR = "#3b82f6"; // Primary blue from theme
const BG_COLOR = "#ffffff"; // Background
const TEXT_COLOR = "#1e293b"; // Foreground
const MUTED_COLOR = "#64748b"; // Muted foreground

interface BaseTemplateProps {
  previewText: string;
  children: string;
}

/**
 * Base HTML wrapper with branding
 */
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
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BG_COLOR}; color: ${TEXT_COLOR}; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: ${BRAND_COLOR}; padding: 24px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: bold; text-decoration: none; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: ${MUTED_COLOR}; }
    .button { display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    h1 { font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: ${TEXT_COLOR}; }
    p { margin-bottom: 16px; }
    .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-table td:last-child { text-align: right; font-weight: 600; }
    .alert { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .alert.warning { background-color: #fffbeb; border-color: #fed7aa; }
    .alert.success { background-color: #f0fdf4; border-color: #bbf7d0; }
    .code { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; background-color: #f8fafc; padding: 2px 4px; border-radius: 3px; font-size: 14px; }
  </style>
</head>
<body>
  <div style="padding: 40px 16px;">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="logo">CodeReverb</a>
      </div>

      <!-- Content -->
      <div class="content">
        ${children}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} CodeReverb. All rights reserved.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy" style="color: ${MUTED_COLOR}; text-decoration: underline;">Privacy Policy</a> •
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms" style="color: ${MUTED_COLOR}; text-decoration: underline;">Terms of Service</a> •
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: ${MUTED_COLOR}; text-decoration: underline;">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// USER-FACING EMAIL TEMPLATES
// ============================================================================

/**
 * Welcome Email Template
 */
export function getWelcomeEmail(name: string): string {
  const content = `
    <h1>Welcome to CodeReverb, ${name}! 🚀</h1>
    <p>Thank you for joining CodeReverb, the AI-powered code review platform that helps teams deliver better code faster.</p>
    <p>Get started in just a few steps:</p>
    <ol>
      <li><strong>Connect your GitHub repository</strong> - Link your repos for automated reviews</li>
      <li><strong>Create an AI persona</strong> - Customize your reviewer's personality and expertise</li>
      <li><strong>Set up webhooks</strong> - Get instant reviews on every pull request</li>
    </ol>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Get Started</a>
    </div>
    <p>Need help? Check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/docs" style="color: ${BRAND_COLOR};">documentation</a> or reach out to support.</p>
  `;
  return getBaseTemplate({
    previewText: "Welcome to CodeReverb!",
    children: content,
  });
}

/**
 * Email Verification Template
 */
export function getEmailVerificationEmail(
  name: string,
  verificationUrl: string,
): string {
  const content = `
    <h1>Verify Your Email Address</h1>
    <p>Hi ${name},</p>
    <p>Thank you for signing up for CodeReverb! To complete your registration and start reviewing code with AI, please verify your email address.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: ${MUTED_COLOR};">If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 12px; color: ${BRAND_COLOR};">${verificationUrl}</p>
  `;
  return getBaseTemplate({
    previewText: "Verify your CodeReverb account",
    children: content,
  });
}

/**
 * Password Reset Template
 */
export function getPasswordResetEmail(name: string, resetUrl: string): string {
  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password for your CodeReverb account. If you made this request, click the button below to set a new password.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email.</p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: ${MUTED_COLOR};">If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 12px; color: ${BRAND_COLOR};">${resetUrl}</p>
  `;
  return getBaseTemplate({
    previewText: "Reset your CodeReverb password",
    children: content,
  });
}

/**
 * OTP/2FA Template
 */
export function getOtpEmail(name: string, otp: string): string {
  const content = `
    <h1>Your Verification Code</h1>
    <p>Hi ${name},</p>
    <p>For security purposes, we've sent you a one-time verification code. Please enter this code to complete your login.</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="display: inline-block; background-color: #f8fafc; border: 2px solid ${BRAND_COLOR}; border-radius: 8px; padding: 16px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: ${BRAND_COLOR};">
        ${otp}
      </div>
    </div>
    <p>This code will expire in 10 minutes. If you didn't request this code, please contact support immediately.</p>
  `;
  return getBaseTemplate({
    previewText: "Your CodeReverb verification code",
    children: content,
  });
}

/**
 * Review Complete Notification Template
 */
export function getReviewCompleteEmail(
  name: string,
  prTitle: string,
  repoName: string,
  reviewUrl: string,
  reviewSummary?: string,
): string {
  const content = `
    <h1>AI Code Review Complete ✅</h1>
    <p>Hi ${name},</p>
    <p>Your pull request has been analyzed by our AI reviewer. The review is now ready for your review!</p>

    <table class="info-table">
      <tr>
        <td>Repository</td>
        <td>${repoName}</td>
      </tr>
      <tr>
        <td>Pull Request</td>
        <td>${prTitle}</td>
      </tr>
    </table>

    ${reviewSummary ? `<div class="alert success"><strong>Review Summary:</strong> ${reviewSummary}</div>` : ""}

    <div style="text-align: center; margin-top: 24px;">
      <a href="${reviewUrl}" class="button">View Full Review</a>
    </div>

    <p>Check out the detailed feedback, suggestions, and code improvements in your GitHub pull request.</p>
  `;
  return getBaseTemplate({
    previewText: `Review complete for ${prTitle}`,
    children: content,
  });
}

/**
 * Review Error Notification Template
 */
export function getReviewErrorEmail(
  name: string,
  prTitle: string,
  repoName: string,
  error: string,
  retryUrl?: string,
): string {
  const content = `
    <h1>Review Error ⚠️</h1>
    <p>Hi ${name},</p>
    <p>We encountered an issue while processing the AI review for your pull request. Our team has been notified and is working to resolve this.</p>

    <table class="info-table">
      <tr>
        <td>Repository</td>
        <td>${repoName}</td>
      </tr>
      <tr>
        <td>Pull Request</td>
        <td>${prTitle}</td>
      </tr>
    </table>

    <div class="alert">
      <strong>Error Details:</strong> ${error}
    </div>

    ${
      retryUrl
        ? `
    <div style="text-align: center; margin-top: 24px;">
      <a href="${retryUrl}" class="button">Retry Review</a>
    </div>
    `
        : ""
    }

    <p>If this issue persists, please contact our support team for assistance.</p>
  `;
  return getBaseTemplate({
    previewText: `Review error for ${prTitle}`,
    children: content,
  });
}

/**
 * Repository Connected Template
 */
export function getRepositoryConnectedEmail(
  name: string,
  repoName: string,
  setupUrl: string,
): string {
  const content = `
    <h1>Repository Connected Successfully ✅</h1>
    <p>Hi ${name},</p>
    <p>Great news! Your repository <strong>${repoName}</strong> has been successfully connected to CodeReverb.</p>
    <p>Next steps to start receiving AI code reviews:</p>
    <ol>
      <li><strong>Configure webhooks</strong> - Enable automatic reviews on pull requests</li>
      <li><strong>Select AI personas</strong> - Choose reviewers for your repository</li>
      <li><strong>Set review rules</strong> - Customize when and how reviews are triggered</li>
    </ol>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${setupUrl}" class="button">Configure Repository</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: `Repository ${repoName} connected`,
    children: content,
  });
}

/**
 * Persona Created Template
 */
export function getPersonaCreatedEmail(
  name: string,
  personaName: string,
  personaUrl: string,
): string {
  const content = `
    <h1>New AI Persona Created 🤖</h1>
    <p>Hi ${name},</p>
    <p>Congratulations! You've successfully created a new AI reviewer persona: <strong>${personaName}</strong>.</p>
    <p>Your AI reviewer is now ready to provide code reviews with the personality and expertise you configured. You can:</p>
    <ul>
      <li>Assign it to specific repositories</li>
      <li>Fine-tune its review criteria</li>
      <li>Monitor its performance and feedback</li>
    </ul>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${personaUrl}" class="button">View Persona Details</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: `AI Persona ${personaName} created`,
    children: content,
  });
}

/**
 * Webhook Setup Success Template
 */
export function getWebhookSetupEmail(
  name: string,
  repoName: string,
  webhookUrl: string,
): string {
  const content = `
    <h1>Webhook Setup Complete 🔗</h1>
    <p>Hi ${name},</p>
    <p>Webhooks have been successfully configured for <strong>${repoName}</strong>. You'll now receive automatic AI code reviews on every pull request!</p>
    <p>What happens next:</p>
    <ul>
      <li>New pull requests will trigger automatic reviews</li>
      <li>AI comments will be posted directly on GitHub</li>
      <li>You'll receive email notifications for review completion</li>
    </ul>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${webhookUrl}" class="button">View Webhook Settings</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: `Webhooks configured for ${repoName}`,
    children: content,
  });
}

/**
 * Low Credits Alert Template
 */
export function getLowCreditsEmail(
  name: string,
  creditsRemaining: number,
  upgradeUrl: string,
): string {
  const content = `
    <h1>Running Low on Credits ⚠️</h1>
    <p>Hi ${name},</p>
    <p>Your CodeReverb credits are running low. To continue receiving AI-powered code reviews, you'll need to top up your account.</p>

    <div style="text-align: center; margin: 24px 0;">
      <div style="display: inline-block; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 16px; font-size: 24px; font-weight: bold; color: #ef4444;">
        ${creditsRemaining} Credits Remaining
      </div>
    </div>

    <p>Credits are used for AI analysis, code suggestions, and advanced review features. Don't let your development workflow slow down!</p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${upgradeUrl}" class="button">Top Up Credits</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: "Low credits alert",
    children: content,
  });
}

/**
 * Subscription Confirmation Template
 */
export function getSubscriptionConfirmationEmail(
  name: string,
  planName: string,
  amount: number,
  billingUrl: string,
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);

  const content = `
    <h1>Subscription Activated 🎉</h1>
    <p>Hi ${name},</p>
    <p>Welcome to the <strong>${planName}</strong> plan! Your subscription is now active and you have full access to all premium features.</p>

    <table class="info-table">
      <tr>
        <td>Plan</td>
        <td>${planName}</td>
      </tr>
      <tr>
        <td>Amount</td>
        <td>${formattedAmount}</td>
      </tr>
      <tr>
        <td>Status</td>
        <td>Active</td>
      </tr>
    </table>

    <p>You now have access to advanced AI models, unlimited repositories, custom personas, and priority support.</p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${billingUrl}" class="button">View Billing Details</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: "Subscription confirmed",
    children: content,
  });
}

/**
 * Billing Invoice Template
 */
export function getBillingInvoiceEmail(
  name: string,
  planName: string,
  amount: number,
  billingPeriod: string,
  invoiceUrl: string,
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);

  const content = `
    <h1>Invoice for ${billingPeriod}</h1>
    <p>Hi ${name},</p>
    <p>Your subscription payment has been processed successfully. Here are the details of your recent billing cycle.</p>

    <table class="info-table">
      <tr>
        <td>Plan</td>
        <td>${planName}</td>
      </tr>
      <tr>
        <td>Billing Period</td>
        <td>${billingPeriod}</td>
      </tr>
      <tr>
        <td>Amount</td>
        <td>${formattedAmount}</td>
      </tr>
    </table>

    <p>Your subscription remains active with full access to all features. Thank you for being a valued CodeReverb customer!</p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${invoiceUrl}" class="button">View Full Invoice</a>
    </div>
  `;
  return getBaseTemplate({
    previewText: "Monthly invoice",
    children: content,
  });
}

// ============================================================================
// ADMIN EMAIL TEMPLATES
// ============================================================================

/**
 * New User Registration Alert
 */
export function getNewUserAlertEmail(
  adminName: string,
  userName: string,
  userEmail: string,
  registrationDate: string,
  adminUrl: string,
): string {
  const content = `
    <h1>New User Registration 📈</h1>
    <p>Hi ${adminName},</p>
    <p>A new user has registered on CodeReverb. Here are the details:</p>

    <table class="info-table">
      <tr>
        <td>Name</td>
        <td>${userName}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${userEmail}</td>
      </tr>
      <tr>
        <td>Registration Date</td>
        <td>${registrationDate}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View in Admin Panel</a>
    </div>

    <p>The user onboarding process should guide them through repository connection and webhook setup.</p>
  `;
  return getBaseTemplate({
    previewText: "New user registration",
    children: content,
  });
}

/**
 * System Error Alert
 */
export function getSystemErrorAlertEmail(
  adminName: string,
  error: string,
  timestamp: string,
  details: string,
  adminUrl: string,
): string {
  const content = `
    <h1>System Error Alert 🚨</h1>
    <p>Hi ${adminName},</p>
    <p>A system error has occurred that requires immediate attention:</p>

    <div class="alert">
      <strong>Error:</strong> ${error}
      <br><strong>Timestamp:</strong> ${timestamp}
      <br><strong>Details:</strong> ${details}
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View System Logs</a>
    </div>

    <p>Please investigate this issue promptly to ensure service continuity.</p>
  `;
  return getBaseTemplate({
    previewText: "System error alert",
    children: content,
  });
}

/**
 * High Usage Alert
 */
export function getHighUsageAlertEmail(
  adminName: string,
  metric: string,
  currentValue: string,
  threshold: string,
  adminUrl: string,
): string {
  const content = `
    <h1>High Usage Alert 📊</h1>
    <p>Hi ${adminName},</p>
    <p>A usage metric has exceeded normal thresholds:</p>

    <table class="info-table">
      <tr>
        <td>Metric</td>
        <td>${metric}</td>
      </tr>
      <tr>
        <td>Current Value</td>
        <td>${currentValue}</td>
      </tr>
      <tr>
        <td>Threshold</td>
        <td>${threshold}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View Usage Dashboard</a>
    </div>

    <p>Monitor this closely and consider scaling resources if needed.</p>
  `;
  return getBaseTemplate({
    previewText: "High usage alert",
    children: content,
  });
}

/**
 * Review Failure Alert
 */
export function getReviewFailureAlertEmail(
  adminName: string,
  prTitle: string,
  repoName: string,
  error: string,
  adminUrl: string,
): string {
  const content = `
    <h1>Review Failure Alert ❌</h1>
    <p>Hi ${adminName},</p>
    <p>An AI code review has failed to complete. The user has been notified, but this requires investigation:</p>

    <table class="info-table">
      <tr>
        <td>Repository</td>
        <td>${repoName}</td>
      </tr>
      <tr>
        <td>Pull Request</td>
        <td>${prTitle}</td>
      </tr>
    </table>

    <div class="alert">
      <strong>Failure Reason:</strong> ${error}
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View Failure Details</a>
    </div>

    <p>Check the AI service status and retry queue. Consider implementing fallback mechanisms.</p>
  `;
  return getBaseTemplate({
    previewText: "Review failure alert",
    children: content,
  });
}

/**
 * Security Alert
 */
export function getSecurityAlertEmail(
  adminName: string,
  alert: string,
  severity: string,
  details: string,
  adminUrl: string,
): string {
  const severityColor =
    severity === "high"
      ? "#ef4444"
      : severity === "medium"
        ? "#f59e0b"
        : "#6b7280";
  const content = `
    <h1>Security Alert 🔒</h1>
    <p>Hi ${adminName},</p>
    <p>A security-related event has been detected:</p>

    <div class="alert" style="border-color: ${severityColor};">
      <strong>Alert:</strong> ${alert}
      <br><strong>Severity:</strong> <span style="color: ${severityColor}; font-weight: bold;">${severity.toUpperCase()}</span>
      <br><strong>Details:</strong> ${details}
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View Security Logs</a>
    </div>

    <p>Take immediate action if this is a high-severity alert. Review access logs and consider temporary lockdowns if necessary.</p>
  `;
  return getBaseTemplate({
    previewText: "Security alert",
    children: content,
  });
}

/**
 * Daily Summary Report
 */
export function getDailySummaryEmail(
  adminName: string,
  date: string,
  stats: {
    newUsers: number;
    totalReviews: number;
    failedReviews: number;
    activeRepos: number;
  },
  adminUrl: string,
): string {
  const content = `
    <h1>Daily Summary Report 📅</h1>
    <p>Hi ${adminName},</p>
    <p>Here's your daily activity summary for ${date}:</p>

    <table class="info-table">
      <tr>
        <td>New Users</td>
        <td>${stats.newUsers}</td>
      </tr>
      <tr>
        <td>Total Reviews</td>
        <td>${stats.totalReviews}</td>
      </tr>
      <tr>
        <td>Failed Reviews</td>
        <td>${stats.failedReviews}</td>
      </tr>
      <tr>
        <td>Active Repositories</td>
        <td>${stats.activeRepos}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View Full Dashboard</a>
    </div>

    <p>Keep up the great work maintaining CodeReverb's performance!</p>
  `;
  return getBaseTemplate({
    previewText: `Daily summary for ${date}`,
    children: content,
  });
}

/**
 * Failed Payment Alert
 */
export function getFailedPaymentAlertEmail(
  adminName: string,
  userEmail: string,
  amount: number,
  failureReason: string,
  adminUrl: string,
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);

  const content = `
    <h1>Failed Payment Alert 💳</h1>
    <p>Hi ${adminName},</p>
    <p>A subscription payment has failed and requires attention:</p>

    <table class="info-table">
      <tr>
        <td>User</td>
        <td>${userEmail}</td>
      </tr>
      <tr>
        <td>Amount</td>
        <td>${formattedAmount}</td>
      </tr>
      <tr>
        <td>Failure Reason</td>
        <td>${failureReason}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="button">View Payment Details</a>
    </div>

    <p>Contact the user to resolve the payment issue and prevent service interruption.</p>
  `;
  return getBaseTemplate({
    previewText: "Failed payment alert",
    children: content,
  });
}
