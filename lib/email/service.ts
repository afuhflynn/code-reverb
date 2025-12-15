import nodemailer from "nodemailer";

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
        from: process.env.FROM_EMAIL || "noreply@code-reverb.dev",
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

  async sendReviewCompleteNotification(
    userEmail: string,
    prTitle: string,
    repoName: string,
    reviewUrl: string
  ): Promise<void> {
    const subject = `AI Code Review Complete: ${prTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">AI Code Review Complete</h2>
        <p>Hello,</p>
        <p>Your pull request has been reviewed by our AI:</p>
        <ul>
          <li><strong>Repository:</strong> ${repoName}</li>
          <li><strong>PR Title:</strong> ${prTitle}</li>
        </ul>
        <p>
          <a href="${reviewUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Review
          </a>
        </p>
        <p>Thank you for using Code-Reverb!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message from Code-Reverb. Please do not reply to this email.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const subject = "Welcome to Code-Reverb!";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Code-Reverb, ${userName}!</h2>
        <p>Thank you for joining Code-Reverb, the AI-powered code review platform.</p>
        <p>Get started by:</p>
        <ol>
          <li>Connecting your first GitHub repository</li>
          <li>Creating or selecting an AI persona for reviews</li>
          <li>Setting up webhooks for automatic reviews</li>
        </ol>
        <p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Get Started
          </a>
        </p>
        <p>Happy coding!</p>
        <p>The Code-Reverb Team</p>
      </div>
    `;

    await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendErrorNotification(
    userEmail: string,
    error: string,
    prTitle?: string
  ): Promise<void> {
    const subject = `Code-Reverb Review Error${prTitle ? `: ${prTitle}` : ""}`;
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
          <a href="mailto:support@code-reverb.dev" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Contact Support
          </a>
        </p>
        <p>Sorry for the inconvenience.</p>
        <p>The Code-Reverb Team</p>
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
