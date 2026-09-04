import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';
import { Response } from 'express';

export const SESSION_COOKIE_NAME = 'sms_session';

export interface UserSessionPayload {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
  };
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string | null;
    roleId: string;
    role: string;
    permissions: string[];
    isEmailVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    avatarUrl: string | null;
  };
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  // Standard duration: 8 hours; Remember me: 30 days
  private readonly DEFAULT_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
  private readonly REMEMBER_ME_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a 128-character cryptographically secure random session identifier.
   */
  generateSessionId(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Creates a new session record in the database.
   */
  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    rememberMe: boolean = false,
  ): Promise<{ sessionId: string; expiresAt: Date }> {
    const sessionId = this.generateSessionId();
    const duration = rememberMe ? this.REMEMBER_ME_DURATION_MS : this.DEFAULT_SESSION_DURATION_MS;
    const expiresAt = new Date(Date.now() + duration);

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId,
        ipAddress: ipAddress ? ipAddress.substring(0, 45) : null,
        userAgent: userAgent || null,
        expiresAt,
      },
    });

    // Update user's last login timestamp
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });

    return { sessionId, expiresAt };
  }

  /**
   * Validates an active session ID and returns the hydrated user with role and permissions.
   */
  async validateSession(sessionId: string): Promise<UserSessionPayload | null> {
    if (!sessionId || typeof sessionId !== 'string') {
      return null;
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check expiration
    if (new Date() > session.expiresAt) {
      this.logger.debug(`Session ${sessionId.substring(0, 8)}... has expired. Cleaning up.`);
      await this.revokeSession(sessionId).catch(() => {});
      return null;
    }

    const user = session.user;
    if (!user || !user.isActive || user.isDeleted) {
      return null;
    }

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.code);

    return {
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        roleId: user.roleId,
        role: user.role.name,
        permissions,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Revokes a single session.
   */
  async revokeSession(sessionId: string): Promise<void> {
    if (!sessionId) return;
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
    } catch {
      // Session might already be deleted
    }
  }

  /**
   * Revokes all active sessions for a user (e.g., upon password reset or security event).
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    if (!userId) return;
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Sets secure, HttpOnly session cookie on the outgoing response.
   */
  setSessionCookie(res: Response, sessionId: string, expiresAt: Date): void {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });
  }

  /**
   * Clears the session cookie on the outgoing response.
   */
  clearSessionCookie(res: Response): void {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }
}
