import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { EmailVerificationService } from './email-verification.service';
import { GoogleOAuthService } from './google-oauth.service';
import { MailService } from './mail.service';
import { RolesService } from '../../roles/roles.service';
import {
  LoginDto,
  RegisterDto,
  GoogleLoginDto,
  VerifyEmailLinkDto,
  VerifyEmailOtpDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly mailService: MailService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Common registration for all users.
   */
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const username = dto.username.toLowerCase().trim();

    // Check unique email
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email address is already registered');
    }

    // Check unique username
    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password using Argon2id
    const passwordHash = await this.passwordService.hashPassword(dto.password);

    // Get default role (Cashier / Staff)
    const defaultRole = await this.rolesService.getDefaultRole();

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName: dto.fullName.trim(),
        phone: dto.phone ? dto.phone.trim() : null,
        roleId: defaultRole.id,
        isEmailVerified: false,
        isActive: true,
        isDeleted: false,
      },
      include: {
        role: true,
      },
    });

    // Generate email verification request (sends via Gmail SMTP)
    await this.emailVerificationService.createVerificationRequest(user.id, user.email);

    this.logger.log(`New user registered: ${user.id} (${user.email})`);

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
      email: user.email,
    };
  }

  /**
   * Common primary login endpoint.
   */
  async login(dto: LoginDto, req: Request, res: Response) {
    const identifier = dto.identifier.toLowerCase().trim();

    // Find user by email OR username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Please contact an administrator.');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account was registered via Google Sign-In. Please sign in using Google.',
      );
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const ip = req?.ip || req?.socket?.remoteAddress || undefined;
    const userAgent = (req?.headers && req.headers['user-agent']) || undefined;
    const { sessionId, expiresAt } = await this.sessionService.createSession(
      user.id,
      ip,
      userAgent,
      dto.rememberMe,
    );

    // Set HttpOnly cookie
    this.sessionService.setSessionCookie(res, sessionId, expiresAt);

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.code);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
        permissions,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
      message: 'Login successful',
    };
  }

  /**
   * Google OAuth login / account registration (POST /auth/google — ID token flow).
   * Used by Google Identity Services / One-Tap integrations.
   */
  async googleLogin(dto: GoogleLoginDto, req: Request, res: Response) {
    const googleProfile = await this.googleOAuthService.verifyIdToken(dto.idToken);

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleProfile.googleId }, { email: googleProfile.email }],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (user) {
      if (user.isDeleted) {
        throw new UnauthorizedException('Account not found.');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('Account has been deactivated.');
      }

      // Link Google ID and update avatar if not already set
      if (!user.googleId || !user.isEmailVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleProfile.googleId,
            isEmailVerified: true,
            emailVerifiedAt: user.emailVerifiedAt || new Date(),
            avatarUrl: user.avatarUrl || googleProfile.avatarUrl || null,
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });
      }
    } else {
      // Create new user with Google identity
      const defaultRole = await this.rolesService.getDefaultRole();
      const baseUsername = googleProfile.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const uniqueSuffix = crypto.randomInt(100, 999).toString();
      const username = `${baseUsername}_${uniqueSuffix}`.substring(0, 50);

      user = await this.prisma.user.create({
        data: {
          username,
          email: googleProfile.email,
          fullName: googleProfile.fullName,
          googleId: googleProfile.googleId,
          avatarUrl: googleProfile.avatarUrl || null,
          roleId: defaultRole.id,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          isActive: true,
          isDeleted: false,
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      });
    }

    const ip = req?.ip || req?.socket?.remoteAddress || undefined;
    const userAgent = (req?.headers && req.headers['user-agent']) || undefined;
    const { sessionId, expiresAt } = await this.sessionService.createSession(
      user.id,
      ip,
      userAgent,
      true, // Google logins default to remember
    );

    this.sessionService.setSessionCookie(res, sessionId, expiresAt);

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.code);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
        permissions,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
      message: 'Google authentication successful',
    };
  }

  /**
   * Google OAuth callback for authorization-code flow (GET /auth/google/callback).
   * Called after Google redirects back with ?code= and ?state= parameters.
   * Handles all three user provisioning cases and sets the SMS session cookie.
   */
  async googleCallback(code: string, req: Request, res: Response): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const googleProfile = await this.googleOAuthService.exchangeCodeAndVerify(code);

    // Reject unverified emails from Google
    if (!googleProfile.emailVerified) {
      this.logger.warn(`Google OAuth rejected: unverified email for ${googleProfile.email}`);
      res.redirect(`${frontendUrl}/login?error=google_email_unverified`);
      return;
    }

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleProfile.googleId }, { email: googleProfile.email }],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (user) {
      // CASE 1 & 2: Existing user (by googleId or matching verified email)
      if (user.isDeleted) {
        res.redirect(`${frontendUrl}/login?error=account_not_found`);
        return;
      }
      if (!user.isActive) {
        res.redirect(`${frontendUrl}/login?error=account_deactivated`);
        return;
      }

      // Link Google ID if not yet linked; mark email verified
      if (!user.googleId || !user.isEmailVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleProfile.googleId,
            isEmailVerified: true,
            emailVerifiedAt: user.emailVerifiedAt || new Date(),
            avatarUrl: user.avatarUrl || googleProfile.avatarUrl || null,
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });
      }
    } else {
      // CASE 3: New user — create with Google identity
      const defaultRole = await this.rolesService.getDefaultRole();
      const baseUsername = googleProfile.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const uniqueSuffix = crypto.randomInt(100, 999).toString();
      const username = `${baseUsername}_${uniqueSuffix}`.substring(0, 50);

      try {
        user = await this.prisma.user.create({
          data: {
            username,
            email: googleProfile.email,
            fullName: googleProfile.fullName,
            googleId: googleProfile.googleId,
            avatarUrl: googleProfile.avatarUrl || null,
            roleId: defaultRole.id,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            isActive: true,
            isDeleted: false,
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });
        this.logger.log(`New Google user registered: ${user.id} (${user.email})`);
      } catch (err: any) {
        // Handle username collision at database level — retry with different suffix
        if (err?.code === 'P2002') {
          const retrySuffix = crypto.randomInt(1000, 9999).toString();
          const retryUsername = `${baseUsername}_${retrySuffix}`.substring(0, 50);
          user = await this.prisma.user.create({
            data: {
              username: retryUsername,
              email: googleProfile.email,
              fullName: googleProfile.fullName,
              googleId: googleProfile.googleId,
              avatarUrl: googleProfile.avatarUrl || null,
              roleId: defaultRole.id,
              isEmailVerified: true,
              emailVerifiedAt: new Date(),
              isActive: true,
              isDeleted: false,
            },
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          });
          this.logger.log(`New Google user registered (retry): ${user.id} (${user.email})`);
        } else {
          throw err;
        }
      }
    }

    // Create SMS session — same mechanism as email/password login
    const ip = req?.ip || req?.socket?.remoteAddress || undefined;
    const userAgent = (req?.headers && req.headers['user-agent']) || undefined;
    const { sessionId, expiresAt } = await this.sessionService.createSession(
      user.id,
      ip,
      userAgent,
      true, // Google logins: 30-day remember session
    );

    this.sessionService.setSessionCookie(res, sessionId, expiresAt);
    this.logger.log(`Google OAuth callback login successful for user: ${user.id}`);

    // Redirect to frontend dashboard
    res.redirect(`${frontendUrl}/`);
  }

  /**
   * Verify email via link token.
   */
  async verifyEmailLink(dto: VerifyEmailLinkDto) {
    return this.emailVerificationService.verifyToken(dto.token);
  }

  /**
   * Verify email via 6-digit OTP code.
   */
  async verifyEmailOtp(dto: VerifyEmailOtpDto) {
    return this.emailVerificationService.verifyOtp(dto.email, dto.otpCode);
  }

  /**
   * Resend verification email.
   */
  async resendVerification(dto: ResendVerificationDto) {
    return this.emailVerificationService.resendVerification(dto.email);
  }

  /**
   * Forgot password initiation.
   * Generates a secure reset token and sends it via Gmail SMTP.
   * Does NOT reveal whether the email exists.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.isActive && !user.isDeleted) {
      const resetToken = crypto.randomBytes(48).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      // Send reset email via Gmail SMTP — token is NOT logged
      await this.mailService.sendPasswordResetEmail({
        to: email,
        token: resetToken,
        fullName: user.fullName,
      });

      this.logger.log(`Password reset dispatched for: ${email}`);
    }

    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  /**
   * Reset password execution.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || new Date() > resetRecord.expiresAt) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const newPasswordHash = await this.passwordService.hashPassword(dto.newPassword);

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash },
      }),
    ]);

    // Invalidate all existing active sessions for security
    await this.sessionService.revokeAllUserSessions(resetRecord.userId);

    return {
      message: 'Password has been reset successfully. Please sign in with your new password.',
    };
  }

  /**
   * Session logout.
   */
  async logout(sessionId: string, res: Response) {
    if (sessionId) {
      await this.sessionService.revokeSession(sessionId);
    }
    this.sessionService.clearSessionCookie(res);
    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Get authenticated user profile.
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || user.isDeleted || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.code);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      roleId: user.roleId,
      role: user.role.name,
      permissions,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
