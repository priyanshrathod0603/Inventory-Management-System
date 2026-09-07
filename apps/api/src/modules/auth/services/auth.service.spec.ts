import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { EmailVerificationService } from './email-verification.service';
import { GoogleOAuthService } from './google-oauth.service';
import { MailService } from './mail.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

/**
 * AuthService Test Suite — IMS Universal Admin Access Model
 *
 * No role assignment, no role lookup, no RolesService dependency.
 * Every registered user gets universal Admin access.
 */
describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    permission: {
      findMany: jest.fn().mockResolvedValue([
        { code: 'create_sale' },
        { code: 'view_products' },
        { code: 'manage_users' },
      ]),
    },
    passwordResetToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  const mockPasswordService = {
    hashPassword: jest.fn().mockResolvedValue('argon2id$hashed'),
    verifyPassword: jest.fn().mockResolvedValue(true),
  };

  const mockSessionService = {
    createSession: jest.fn().mockResolvedValue({ sessionId: 'session-123', expiresAt: new Date() }),
    setSessionCookie: jest.fn(),
    revokeSession: jest.fn(),
    clearSessionCookie: jest.fn(),
    revokeAllUserSessions: jest.fn(),
  };

  const mockEmailVerificationService = {
    createVerificationRequest: jest.fn().mockResolvedValue({ token: 'tok', otpCode: '123456' }),
    verifyToken: jest.fn().mockResolvedValue({ success: true, message: 'Verified' }),
    verifyOtp: jest.fn().mockResolvedValue({ success: true, message: 'Verified' }),
    resendVerification: jest.fn().mockResolvedValue({ sent: true }),
  };

  const mockGoogleOAuthService = {
    verifyIdToken: jest.fn(),
    exchangeCodeAndVerify: jest.fn(),
    generateAuthUrl: jest.fn(),
    isConfigured: jest.fn().mockReturnValue(true),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
    sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: EmailVerificationService, useValue: mockEmailVerificationService },
        { provide: GoogleOAuthService, useValue: mockGoogleOAuthService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    // Re-set the default mock for permission.findMany after clearAllMocks
    mockPrisma.permission.findMany.mockResolvedValue([
      { code: 'create_sale' },
      { code: 'view_products' },
      { code: 'manage_users' },
    ]);
  });

  describe('register', () => {
    it('should register a new user successfully and dispatch verification (no role assigned)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'rahul@example.com',
        username: 'rahul_c',
      });

      const result = await service.register({
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        username: 'rahul_c',
        password: 'Password123!',
      });

      expect(result.userId).toBe('new-user-id');
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith('Password123!');
      expect(mockEmailVerificationService.createVerificationRequest).toHaveBeenCalledWith(
        'new-user-id',
        'rahul@example.com',
      );
      // CRITICAL: No role service should be called
    });

    it('should throw ConflictException if email already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'existing-id' });

      await expect(
        service.register({
          fullName: 'Rahul Sharma',
          email: 'existing@example.com',
          username: 'rahul_new',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if username already taken', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce({ id: 'existing-id' }); // username check fails

      await expect(
        service.register({
          fullName: 'Rahul Sharma',
          email: 'new@example.com',
          username: 'taken_username',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate valid credentials and issue session cookie with full permissions', async () => {
      const mockUser = {
        id: 'user-1',
        username: 'rahul_c',
        email: 'rahul@example.com',
        passwordHash: 'argon2id$hashed',
        fullName: 'Rahul Sharma',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        avatarUrl: null,
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValue(true);
      mockPrisma.permission.findMany.mockResolvedValue([
        { code: 'create_sale' },
        { code: 'view_products' },
        { code: 'manage_users' },
      ]);

      const mockReq: any = { ip: '127.0.0.1', headers: {} };
      const mockRes: any = {};
      mockSessionService.createSession.mockResolvedValue({ sessionId: 'session-123', expiresAt: new Date() });

      const result = await service.login(
        { identifier: 'rahul@example.com', password: 'Password123!' },
        mockReq,
        mockRes,
      );

      expect(result.message).toBe('Login successful');
      expect(result.user.username).toBe('rahul_c');
      expect(result.user.accessLevel).toBe('Admin');
      expect(result.user.permissions).toContain('create_sale');
      expect(mockSessionService.createSession).toHaveBeenCalled();
      expect(mockSessionService.setSessionCookie).toHaveBeenCalled();
    });

    it('should reject login for invalid password with UnauthorizedException', async () => {
      const mockUser = {
        id: 'user-1',
        passwordHash: 'argon2id$hashed',
        isActive: true,
        isDeleted: false,
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValue(false);

      const mockReq: any = { ip: '127.0.0.1', headers: {} };
      const mockRes: any = {};

      await expect(
        service.login(
          { identifier: 'rahul@example.com', password: 'WrongPassword' },
          mockReq,
          mockRes,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject login for deactivated account', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-1',
        passwordHash: 'hash',
        isActive: false,
        isDeleted: false,
      });

      const mockReq: any = { headers: {} };
      const mockRes: any = {};

      await expect(
        service.login({ identifier: 'rahul@example.com', password: 'Password123!' }, mockReq, mockRes),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('googleLogin (POST ID token flow)', () => {
    it('should authenticate verified Google OAuth user and create session with full permissions', async () => {
      mockGoogleOAuthService.verifyIdToken.mockResolvedValue({
        googleId: 'google-sub-123',
        email: 'googleuser@gmail.com',
        fullName: 'Google User',
        avatarUrl: 'https://avatar.url',
        emailVerified: true,
      });

      const existingUser = {
        id: 'google-user-id',
        username: 'google_user',
        email: 'googleuser@gmail.com',
        googleId: 'google-sub-123',
        fullName: 'Google User',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        avatarUrl: 'https://avatar.url',
      };

      mockPrisma.user.findFirst.mockResolvedValue(existingUser);
      mockPrisma.permission.findMany.mockResolvedValue([{ code: 'create_sale' }]);
      mockSessionService.createSession.mockResolvedValue({ sessionId: 'session-google', expiresAt: new Date() });

      const mockReq: any = { headers: {} };
      const mockRes: any = {};

      const result = await service.googleLogin({ idToken: 'valid-google-id-token' }, mockReq, mockRes);
      expect(result.message).toBe('Google authentication successful');
      expect(result.user.email).toBe('googleuser@gmail.com');
      expect(result.user.accessLevel).toBe('Admin');
      expect(mockSessionService.setSessionCookie).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token and call mailService.sendPasswordResetEmail', async () => {
      const mockUser = {
        id: 'user-reset-id',
        email: 'reset@example.com',
        fullName: 'Reset User',
        isActive: true,
        isDeleted: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.passwordResetToken.create.mockResolvedValue({});
      mockMailService.sendPasswordResetEmail.mockResolvedValue({ success: true });

      const result = await service.forgotPassword({ email: 'reset@example.com' });

      expect(result.message).toContain('If an account exists');
      // Must call mailService — not just log
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'reset@example.com',
          fullName: 'Reset User',
          token: expect.any(String),
        }),
      );
      // Reset token must be a non-empty hex string (48 bytes = 96 hex chars)
      const callArgs = mockMailService.sendPasswordResetEmail.mock.calls[0][0];
      expect(callArgs.token).toHaveLength(96);
    });

    it('should return same message even if email does not exist (anti-enumeration)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'nonexistent@example.com' });

      expect(result.message).toContain('If an account exists');
      expect(mockMailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password and revoke all sessions', async () => {
      const mockResetRecord = {
        id: 'reset-record-id',
        userId: 'user-id',
        tokenHash: 'some-hash',
        usedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
        user: { id: 'user-id' },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(mockResetRecord);
      mockPrisma.passwordResetToken.update.mockResolvedValue({});
      mockPrisma.user.update.mockResolvedValue({});
      mockSessionService.revokeAllUserSessions.mockResolvedValue(undefined);

      const result = await service.resetPassword({
        token: 'raw-reset-token',
        newPassword: 'NewPassword123!',
      });

      expect(result.message).toContain('reset successfully');
      expect(mockSessionService.revokeAllUserSessions).toHaveBeenCalledWith('user-id');
    });
  });
});
