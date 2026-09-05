import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendVerificationEmailOptions {
  to: string;
  token: string;
  otpCode: string;
}

export interface SendPasswordResetEmailOptions {
  to: string;
  token: string;
  fullName: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns or initializes the Nodemailer SMTP transporter.
   * Reads SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS from environment.
   * Returns null if SMTP is not configured (email will not be sent).
   */
  getTransporter(): Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<number | string>('SMTP_PORT', 587));
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      return null;
    }

    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    return this.transporter;
  }

  /**
   * Sends the official email verification message containing the link and 6-digit OTP code.
   */
  async sendVerificationEmail(
    options: SendVerificationEmailOptions,
  ): Promise<{ success: boolean; messageId?: string }> {
    const { to, token, otpCode } = options;
    const fromAddress =
      this.configService.get<string>('EMAIL_FROM') ||
      'Stock Management System <noreply@sms-system.internal>';

    const frontendBaseUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      this.configService.get<string>('NEXT_PUBLIC_APP_URL') ||
      'http://localhost:3000';

    const verificationLink = `${frontendBaseUrl.replace(
      /\/+$/,
      '',
    )}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const transporter = this.getTransporter();

    // If SMTP is not configured, log dispatch diagnostic for local development
    if (!transporter) {
      this.logger.warn(
        `[MAIL NOTICE] SMTP is not configured. Verification email was not dispatched via network.\n` +
          `[DEV DISPATCH] To: ${to} | 6-Digit OTP: ${otpCode} | Link: ${verificationLink}`,
      );
      return { success: false };
    }

    const subject = 'Verify your email address — Stock Management System';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.5; }
    .container { max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .header { background-color: #4f46e5; padding: 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 20px; font-weight: 700; letter-spacing: 0.05em; margin: 0; }
    .content { padding: 32px 28px; }
    .title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
    .text { font-size: 14px; color: #475569; margin: 0 0 20px 0; }
    .otp-box { background-color: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.1em; color: #64748b; margin-bottom: 6px; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.3em; color: #4f46e5; margin: 0; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 8px; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
    .expiry-note { font-size: 12px; color: #d97706; font-weight: 600; margin-top: 16px; }
    .raw-link { word-break: break-all; font-size: 12px; color: #6366f1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Stock Management System</h1>
    </div>
    <div class="content">
      <h2 class="title">Verify Your Email Address</h2>
      <p class="text">
        Welcome to SMS! You recently registered an account for <strong>${to}</strong>.
        Please verify your email address to complete your activation.
      </p>

      <div class="otp-box">
        <div class="otp-label">Your 6-Digit Verification Code</div>
        <div class="otp-code">${otpCode}</div>
      </div>

      <div class="btn-container">
        <a href="${verificationLink}" class="btn" target="_blank">Verify Email Address</a>
      </div>

      <p class="text">
        Or copy and paste this link into your browser:<br>
        <span class="raw-link">${verificationLink}</span>
      </p>

      <p class="expiry-note">
        ⏱ This verification code and link will expire in 15 minutes.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">If you did not create an account with SMS, you can safely ignore this email.</p>
      <p style="margin: 0;">Stock Management System (SMS) — Secure Counter Billing &amp; Inventory Platform</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const textContent = `
Stock Management System (SMS) — Email Verification

Welcome to SMS! You registered an account for: ${to}

Your 6-Digit Verification Code:
${otpCode}

Or verify via direct link:
${verificationLink}

Note: This verification code and link expire in 15 minutes.
If you did not request this registration, please safely disregard this email.
    `.trim();

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      this.logger.log(
        `Verification email sent to ${to} [Message ID: ${info.messageId}]`,
      );
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      this.logger.error(
        `Failed to dispatch verification email to ${to}: ${error.message}`,
        error.stack,
      );
      return { success: false };
    }
  }

  /**
   * Sends a password reset email containing a secure reset link.
   * The reset token is NEVER logged — it only appears in the email.
   */
  async sendPasswordResetEmail(
    options: SendPasswordResetEmailOptions,
  ): Promise<{ success: boolean; messageId?: string }> {
    const { to, token, fullName } = options;
    const fromAddress =
      this.configService.get<string>('EMAIL_FROM') ||
      'Stock Management System <noreply@sms-system.internal>';

    const frontendBaseUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';

    const resetLink = `${frontendBaseUrl.replace(
      /\/+$/,
      '',
    )}/reset-password?token=${encodeURIComponent(token)}`;

    const transporter = this.getTransporter();

    if (!transporter) {
      this.logger.warn(
        `[MAIL NOTICE] SMTP is not configured. Password reset email was not dispatched via network.\n` +
          `[DEV DISPATCH] To: ${to} | Reset Link: ${resetLink}`,
      );
      return { success: false };
    }

    const subject = 'Reset your password — Stock Management System';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.5; }
    .container { max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .header { background-color: #4f46e5; padding: 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 20px; font-weight: 700; letter-spacing: 0.05em; margin: 0; }
    .content { padding: 32px 28px; }
    .title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
    .text { font-size: 14px; color: #475569; margin: 0 0 20px 0; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 8px; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
    .expiry-note { font-size: 12px; color: #d97706; font-weight: 600; margin-top: 16px; }
    .raw-link { word-break: break-all; font-size: 12px; color: #6366f1; }
    .warning { font-size: 13px; color: #b45309; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Stock Management System</h1>
    </div>
    <div class="content">
      <h2 class="title">Reset Your Password</h2>
      <p class="text">
        Hi <strong>${fullName}</strong>, we received a request to reset the password for your SMS account
        associated with <strong>${to}</strong>.
      </p>
      <p class="text">
        Click the button below to set a new password:
      </p>

      <div class="btn-container">
        <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
      </div>

      <p class="text">
        Or copy and paste this link into your browser:<br>
        <span class="raw-link">${resetLink}</span>
      </p>

      <p class="expiry-note">
        ⏱ This password reset link will expire in 1 hour.
      </p>

      <div class="warning">
        If you did not request a password reset, please ignore this email. Your password will remain unchanged.
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">For security, never share this link with anyone.</p>
      <p style="margin: 0;">Stock Management System (SMS) — Secure Counter Billing &amp; Inventory Platform</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const textContent = `
Stock Management System (SMS) — Password Reset

Hi ${fullName},

We received a request to reset the password for your SMS account (${to}).

Click or paste the following link to reset your password:
${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email.
Your password will remain unchanged.
    `.trim();

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      this.logger.log(`Password reset email sent to ${to} [Message ID: ${info.messageId}]`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      this.logger.error(
        `Failed to dispatch password reset email to ${to}: ${error.message}`,
        error.stack,
      );
      return { success: false };
    }
  }
}
