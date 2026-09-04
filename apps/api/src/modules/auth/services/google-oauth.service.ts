import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface VerifiedGoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Verifies Google OAuth ID token securely.
   */
  async verifyIdToken(idToken: string): Promise<VerifiedGoogleUser> {
    if (!idToken || typeof idToken !== 'string') {
      throw new UnauthorizedException('Google ID token is required');
    }

    // Support mock tokens in non-production environments for automated security testing
    if (process.env.NODE_ENV !== 'production' && idToken.startsWith('mock-google-token-')) {
      const email = idToken.replace('mock-google-token-', '');
      return {
        googleId: `google-sub-${email}`,
        email: email.toLowerCase().trim(),
        fullName: 'Google Test User',
        avatarUrl: 'https://lh3.googleusercontent.com/test-avatar',
        emailVerified: true,
      };
    }

    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
        { method: 'GET' },
      );

      if (!response.ok) {
        this.logger.warn(`Google tokeninfo verification failed with status ${response.status}`);
        throw new UnauthorizedException('Invalid Google OAuth token');
      }

      const payload = (await response.json()) as any;

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Malformed Google OAuth payload');
      }

      const expectedClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      if (expectedClientId && payload.aud !== expectedClientId) {
        this.logger.warn(`Google OAuth token audience mismatch: ${payload.aud} vs ${expectedClientId}`);
        throw new UnauthorizedException('Google OAuth client ID mismatch');
      }

      const emailVerified =
        payload.email_verified === 'true' || payload.email_verified === true;

      return {
        googleId: payload.sub,
        email: payload.email.toLowerCase().trim(),
        fullName: payload.name || payload.email.split('@')[0],
        avatarUrl: payload.picture,
        emailVerified,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Error verifying Google OAuth token: ${error.message}`, error.stack);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}
