import { Injectable, Logger, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
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

    // Verify Google OAuth is configured
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      this.logger.warn('Google OAuth attempted but GOOGLE_CLIENT_ID is not configured');
      throw new ServiceUnavailableException('Google authentication is not configured. Please set GOOGLE_CLIENT_ID environment variable.');
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

      if (payload.aud !== clientId) {
        this.logger.warn(`Google OAuth token audience mismatch: ${payload.aud} vs ${clientId}`);
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
