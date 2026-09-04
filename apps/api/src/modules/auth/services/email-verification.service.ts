import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MailService } from './mail.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);
  private readonly TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Generates a verification link token (hex) and a 6-digit OTP code.
   */
  async createVerificationRequest(
    userId: string,
    email: string,
  ): Promise<{ token: string; otpCode: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Invalidate prior unused tokens for this user
    await this.prisma.emailVerificationToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(), // mark obsolete
      },
    });

    const token = crypto.randomBytes(48).toString('hex');
    const otpCode = (100000 + crypto.randomInt(0, 900000)).toString();
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_MS);

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        email: normalizedEmail,
        token,
        otpCode,
        expiresAt,
      },
    });

    // Dispatch verification email via Nodemailer SMTP
    await this.mailService.sendVerificationEmail({
      to: normalizedEmail,
      token,
      otpCode,
    });

    return { token, otpCode };
  }

  /**
   * Verifies email via link token.
   */
  async verifyToken(token: string): Promise<{ success: boolean; userId: string; message: string }> {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Verification token is required');
    }

    const verificationRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationRecord) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (verificationRecord.usedAt) {
      throw new BadRequestException('Verification token has already been used');
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw new BadRequestException('Verification token has expired');
    }

    // Atomic update: mark token used and user verified
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: verificationRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verificationRecord.userId },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      }),
    ]);

    this.logger.log(`Email verified for user: ${verificationRecord.userId} (${verificationRecord.email})`);

    return {
      success: true,
      userId: verificationRecord.userId,
      message: 'Email successfully verified',
    };
  }

  /**
   * Verifies email via 6-digit OTP code.
   */
  async verifyOtp(
    email: string,
    otpCode: string,
  ): Promise<{ success: boolean; userId: string; message: string }> {
    if (!email || !otpCode) {
      throw new BadRequestException('Email and OTP code are required');
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verificationRecord = await this.prisma.emailVerificationToken.findFirst({
      where: {
        email: normalizedEmail,
        otpCode: otpCode.trim(),
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (!verificationRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    // Atomic update
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: verificationRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verificationRecord.userId },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      }),
    ]);

    this.logger.log(`Email verified via OTP for user: ${verificationRecord.userId} (${normalizedEmail})`);

    return {
      success: true,
      userId: verificationRecord.userId,
      message: 'Email successfully verified',
    };
  }

  /**
   * Resends verification email if user exists and is not already verified.
   */
  async resendVerification(email: string): Promise<{ sent: boolean; message: string }> {
    if (!email) {
      throw new BadRequestException('Email address is required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Prevent user enumeration: always return standard success message even if email not found
    if (!user || user.isDeleted || !user.isActive) {
      return {
        sent: true,
        message: 'If an account exists with this email, a verification link has been sent.',
      };
    }

    if (user.isEmailVerified) {
      return {
        sent: true,
        message: 'Email is already verified. You can log in.',
      };
    }

    await this.createVerificationRequest(user.id, user.email);

    return {
      sent: true,
      message: 'If an account exists with this email, a verification link has been sent.',
    };
  }
}
