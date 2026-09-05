import {
  Injectable,
  Logger,
  UnauthorizedException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export interface VerifiedGoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface GoogleAuthUrlResult {
  url: string;
  state: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  private oauth2Client: OAuth2Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns (or lazily initializes) the OAuth2Client.
   * Returns null if Google OAuth environment variables are not configured.
   */
  private getOAuth2Client(): OAuth2Client | null {
    if (this.oauth2Client) {
      return this.oauth2Client;
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientId || !clientSecret || !callbackUrl) {
      return null;
    }

    this.oauth2Client = new OAuth2Client(clientId, clientSecret, callbackUrl);
    return this.oauth2Client;
  }

  /**
   * Generates the Google authorization URL for the authorization-code flow.
   * Caller is responsible for generating and storing the state parameter securely.
   */
  generateAuthUrl(state: string): string {
    const client = this.getOAuth2Client();

    if (!client) {
      throw new ServiceUnavailableException(
        'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL.',
      );
    }

    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'select_account',
      scope: ['openid', 'email', 'profile'],
      state,
    });
  }

  /**
   * Exchanges an authorization code for tokens and returns verified Google user info.
   * Uses google-auth-library for proper cryptographic ID token verification.
   */
  async exchangeCodeAndVerify(code: string): Promise<VerifiedGoogleUser> {
    const client = this.getOAuth2Client();

    if (!client) {
      throw new ServiceUnavailableException('Google OAuth is not configured.');
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')!;

    let tokens: { id_token?: string | null };
    try {
      const { tokens: exchangedTokens } = await client.getToken(code);
      tokens = exchangedTokens;
    } catch (error: any) {
      this.logger.warn(`Google OAuth code exchange failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired Google authorization code');
    }

    if (!tokens.id_token) {
      throw new UnauthorizedException('No ID token returned from Google');
    }

    return this.verifyIdTokenWithLibrary(tokens.id_token, clientId, client);
  }

  /**
   * Verifies a Google ID token using the google-auth-library (proper signature verification).
   * Verifies: signature, audience, issuer, expiration, sub, email, email_verified.
   * Used by the authorization-code callback flow.
   */
  private async verifyIdTokenWithLibrary(
    idToken: string,
    clientId: string,
    client: OAuth2Client,
  ): Promise<VerifiedGoogleUser> {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Empty Google ID token payload');
      }

      // Verify required claims
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Malformed Google ID token: missing sub or email');
      }

      // Verify issuer
      const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
      if (!payload.iss || !validIssuers.includes(payload.iss)) {
        this.logger.warn(`Google token issuer mismatch: ${payload.iss}`);
        throw new UnauthorizedException('Google token issuer is invalid');
      }

      // Verify expiration (verifyIdToken already checks this, but explicit guard)
      if (!payload.exp || Date.now() / 1000 > payload.exp) {
        throw new UnauthorizedException('Google ID token has expired');
      }

      const emailVerified =
        payload.email_verified === true || (payload.email_verified as any) === 'true';

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
      this.logger.error(`Google ID token verification failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Failed to verify Google ID token');
    }
  }

  /**
   * Verifies a Google ID token received via POST /auth/google (e.g. from Google Identity Services).
   * Uses google-auth-library for proper cryptographic signature verification.
   * Kept for backward compatibility with the existing POST endpoint.
   */
  async verifyIdToken(idToken: string): Promise<VerifiedGoogleUser> {
    if (!idToken || typeof idToken !== 'string') {
      throw new UnauthorizedException('Google ID token is required');
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      this.logger.warn('Google OAuth attempted but GOOGLE_CLIENT_ID is not configured');
      throw new ServiceUnavailableException(
        'Google authentication is not configured. Please set GOOGLE_CLIENT_ID environment variable.',
      );
    }

    // Use google-auth-library for proper cryptographic verification
    const client = new OAuth2Client(clientId);
    return this.verifyIdTokenWithLibrary(idToken, clientId, client);
  }

  /**
   * Checks whether Google OAuth is fully configured (client ID + secret + callback URL).
   */
  isConfigured(): boolean {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL');
    return !!(clientId && clientSecret && callbackUrl);
  }
}
