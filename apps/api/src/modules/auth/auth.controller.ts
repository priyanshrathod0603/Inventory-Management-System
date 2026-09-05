import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import {
  LoginDto,
  RegisterDto,
  GoogleLoginDto,
  VerifyEmailLinkDto,
  VerifyEmailOtpDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

/** Name of the HttpOnly state cookie used for CSRF protection during OAuth. */
const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Universal user registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully. Email verification dispatched.' })
  @ApiResponse({ status: 409, description: 'Email or username already in use.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Universal common login' })
  @ApiResponse({ status: 200, description: 'Login successful. Sets HttpOnly session cookie.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account.' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, req, res);
  }

  /**
   * POST /auth/google — ID token flow (Google Identity Services / One-Tap).
   * Accepts a verified Google ID token from the frontend.
   */
  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google OAuth authentication (ID token flow)' })
  @ApiResponse({ status: 200, description: 'Google login successful. Sets session cookie.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired Google OAuth token.' })
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(dto, req, res);
  }

  /**
   * GET /auth/google — Authorization-code flow initiation.
   * Generates a cryptographically random state, stores it in an HttpOnly cookie,
   * and redirects the browser to Google's authorization endpoint.
   */
  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth authorization-code flow' })
  @ApiResponse({ status: 302, description: 'Redirects to Google authorization page.' })
  @ApiResponse({ status: 503, description: 'Google OAuth not configured.' })
  async initiateGoogleOAuth(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    // Generate a cryptographically random state parameter for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in an HttpOnly, SameSite=Lax cookie (expires in 10 minutes)
    const stateExpiry = new Date(Date.now() + 10 * 60 * 1000);
    res.cookie(GOOGLE_OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      expires: stateExpiry,
    });

    const authUrl = this.googleOAuthService.generateAuthUrl(state);
    this.logger.log('Initiating Google OAuth authorization-code flow');
    res.redirect(authUrl);
  }

  /**
   * GET /auth/google/callback — Authorization-code flow callback.
   * Google redirects here after the user authenticates.
   * Validates state cookie, exchanges code, verifies identity, creates session,
   * then redirects to frontend dashboard.
   */
  @Public()
  @Get('google/callback')
  @ApiExcludeEndpoint()
  async googleOAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') oauthError: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const isProd = process.env.NODE_ENV === 'production';

    // Handle user-denied consent or other OAuth errors
    if (oauthError) {
      this.logger.warn(`Google OAuth error from provider: ${oauthError}`);
      res.clearCookie(GOOGLE_OAUTH_STATE_COOKIE, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' });
      res.redirect(`${frontendUrl}/login?error=google_oauth_cancelled`);
      return;
    }

    // Validate required parameters
    if (!code || !state) {
      this.logger.warn('Google OAuth callback missing code or state parameter');
      res.redirect(`${frontendUrl}/login?error=google_oauth_invalid`);
      return;
    }

    // Retrieve and validate state from HttpOnly cookie
    const storedState = (req.cookies as Record<string, string>)?.[GOOGLE_OAUTH_STATE_COOKIE];
    if (!storedState || storedState !== state) {
      this.logger.warn('Google OAuth state mismatch — possible CSRF attack');
      res.clearCookie(GOOGLE_OAUTH_STATE_COOKIE, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' });
      res.redirect(`${frontendUrl}/login?error=google_state_mismatch`);
      return;
    }

    // Clear state cookie immediately after validation (single-use)
    res.clearCookie(GOOGLE_OAUTH_STATE_COOKIE, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    try {
      await this.authService.googleCallback(code, req, res);
    } catch (err: any) {
      this.logger.error(`Google OAuth callback failed: ${err.message}`, err.stack);
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }

  @Public()
  @Post('verify-email-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email via link token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid, used, or expired token.' })
  async verifyEmailLink(@Body() dto: VerifyEmailLinkDto) {
    return this.authService.verifyEmailLink(dto);
  }

  @Public()
  @Post('verify-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email via 6-digit OTP code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP code.' })
  async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) {
    return this.authService.verifyEmailOtp(dto);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification token/code' })
  @ApiResponse({ status: 200, description: 'Verification email dispatched if account exists.' })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email dispatched if account exists.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(SessionAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate session' })
  @ApiResponse({ status: 200, description: 'Logged out and session cookie cleared.' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req.sessionId, res);
  }

  @UseGuards(SessionAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile and permissions' })
  @ApiResponse({ status: 200, description: 'Authenticated profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthenticated.' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
