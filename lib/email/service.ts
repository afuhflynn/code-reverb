import * as nodemailer from "nodemailer";
import {
  getWelcomeEmail,
  getReviewCompleteEmail,
  getReviewErrorEmail,
  getEmailVerificationEmail,
  getPasswordResetEmail,
  getOtpEmail,
  getRepositoryConnectedEmail,
  getPersonaCreatedEmail,
  getWebhookSetupEmail,
  getLowCreditsEmail,
  getSubscriptionConfirmationEmail,
  getBillingInvoiceEmail,
  getNewUserAlertEmail,
  getSystemErrorAlertEmail,
  getHighUsageAlertEmail,
  getReviewFailureAlertEmail,
  getSecurityAlertEmail,
  getDailySummaryEmail,
  getFailedPaymentAlertEmail,
} from "./templates";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@CodeReverb.dev",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  // ============================================================================
  // USER EMAIL METHODS
  // ============================================================================

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const subject = "Welcome to CodeReverb!";
    const html = getWelcomeEmail(userName);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendReviewCompleteNotification(
    userEmail: string,
    prTitle: string,
    repoName: string,
    reviewUrl: string,
    userName?: string,
    reviewSummary?: string,
  ): Promise<void> {
    const subject = `AI Code Review Complete: ${prTitle}`;
    const html = getReviewCompleteEmail(
      userName || "Developer",
      prTitle,
      repoName,
      reviewUrl,
      reviewSummary,
    );

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendReviewErrorNotification(
    userEmail: string,
    prTitle: string,
    repoName: string,
    error: string,
    userName?: string,
    retryUrl?: string,
  ): Promise<void> {
    const subject = `CodeReverb Review Error: ${prTitle}`;
    const html = getReviewErrorEmail(
      userName || "Developer",
      prTitle,
      repoName,
      error,
      retryUrl,
    );

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendEmailVerification(
    userEmail: string,
    userName: string,
    verificationUrl: string,
  ): Promise<void> {
    const subject = "Verify your CodeReverb account";
    const html = getEmailVerificationEmail(userName, verificationUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendPasswordReset(
    userEmail: string,
    userName: string,
    resetUrl: string,
  ): Promise<void> {
    const subject = "Reset your CodeReverb password";
    const html = getPasswordResetEmail(userName, resetUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendOtp(
    userEmail: string,
    userName: string,
    otp: string,
  ): Promise<void> {
    const subject = "Your CodeReverb verification code";
    const html = getOtpEmail(userName, otp);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendRepositoryConnected(
    userEmail: string,
    userName: string,
    repoName: string,
    setupUrl: string,
  ): Promise<void> {
    const subject = `Repository ${repoName} connected to CodeReverb`;
    const html = getRepositoryConnectedEmail(userName, repoName, setupUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendPersonaCreated(
    userEmail: string,
    userName: string,
    personaName: string,
    personaUrl: string,
  ): Promise<void> {
    const subject = `AI Persona "${personaName}" created`;
    const html = getPersonaCreatedEmail(userName, personaName, personaUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendWebhookSetup(
    userEmail: string,
    userName: string,
    repoName: string,
    webhookUrl: string,
  ): Promise<void> {
    const subject = `Webhooks configured for ${repoName}`;
    const html = getWebhookSetupEmail(userName, repoName, webhookUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendLowCreditsAlert(
    userEmail: string,
    userName: string,
    creditsRemaining: number,
    upgradeUrl: string,
  ): Promise<void> {
    const subject = "Your CodeReverb credits are running low";
    const html = getLowCreditsEmail(userName, creditsRemaining, upgradeUrl);

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendSubscriptionConfirmation(
    userEmail: string,
    userName: string,
    planName: string,
    amount: number,
    billingUrl: string,
  ): Promise<void> {
    const subject = "Your CodeReverb subscription is confirmed";
    const html = getSubscriptionConfirmationEmail(
      userName,
      planName,
      amount,
      billingUrl,
    );

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendBillingInvoice(
    userEmail: string,
    userName: string,
    planName: string,
    amount: number,
    billingPeriod: string,
    invoiceUrl: string,
  ): Promise<void> {
    const subject = `Your CodeReverb invoice for ${billingPeriod}`;
    const html = getBillingInvoiceEmail(
      userName,
      planName,
      amount,
      billingPeriod,
      invoiceUrl,
    );

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  // ============================================================================
  // ADMIN EMAIL METHODS
  // ============================================================================

  async sendNewUserAlert(
    adminEmail: string,
    adminName: string,
    userName: string,
    userEmail: string,
    registrationDate: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = "New user registered on CodeReverb";
    const html = getNewUserAlertEmail(
      adminName,
      userName,
      userEmail,
      registrationDate,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendSystemErrorAlert(
    adminEmail: string,
    adminName: string,
    error: string,
    timestamp: string,
    details: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = "CodeReverb system error alert";
    const html = getSystemErrorAlertEmail(
      adminName,
      error,
      timestamp,
      details,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendHighUsageAlert(
    adminEmail: string,
    adminName: string,
    metric: string,
    currentValue: string,
    threshold: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = "CodeReverb high usage alert";
    const html = getHighUsageAlertEmail(
      adminName,
      metric,
      currentValue,
      threshold,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendReviewFailureAlert(
    adminEmail: string,
    adminName: string,
    prTitle: string,
    repoName: string,
    error: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = "CodeReverb review failure alert";
    const html = getReviewFailureAlertEmail(
      adminName,
      prTitle,
      repoName,
      error,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendSecurityAlert(
    adminEmail: string,
    adminName: string,
    alert: string,
    severity: string,
    details: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = `CodeReverb security alert - ${severity.toUpperCase()}`;
    const html = getSecurityAlertEmail(
      adminName,
      alert,
      severity,
      details,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendDailySummary(
    adminEmail: string,
    adminName: string,
    date: string,
    stats: {
      newUsers: number;
      totalReviews: number;
      failedReviews: number;
      activeRepos: number;
    },
    adminUrl: string,
  ): Promise<void> {
    const subject = `CodeReverb daily summary - ${date}`;
    const html = getDailySummaryEmail(adminName, date, stats, adminUrl);

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendFailedPaymentAlert(
    adminEmail: string,
    adminName: string,
    userEmail: string,
    amount: number,
    failureReason: string,
    adminUrl: string,
  ): Promise<void> {
    const subject = "CodeReverb failed payment alert";
    const html = getFailedPaymentAlertEmail(
      adminName,
      userEmail,
      amount,
      failureReason,
      adminUrl,
    );

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  async sendErrorNotification(
    userEmail: string,
    error: string,
    prTitle?: string,
  ): Promise<void> {
    const subject = `CodeReverb Review Error${prTitle ? `: ${prTitle}` : ""}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Review Error</h2>
        <p>Hello,</p>
        <p>We encountered an error while processing your code review:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
          <strong>Error:</strong> ${error}
        </div>
        <p>Please try again or contact support if the issue persists.</p>
        <p>
          <a href="mailto:support@CodeReverb.dev" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Contact Support
          </a>
        </p>
        <p>Sorry for the inconvenience.</p>
        <p>The CodeReverb Team</p>
      </div>
    `;

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();
