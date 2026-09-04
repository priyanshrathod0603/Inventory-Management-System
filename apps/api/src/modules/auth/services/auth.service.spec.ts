import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { EmailVerificationService } from './email-verification.service';
import { GoogleOAuthService } from './google-oauth.service';
import { RolesService } from '../../roles/roles.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let passwordService: PasswordService;
  let sessionService: SessionService;
  let emailVerificationService: EmailVerificationService;
  let googleOAuthService: GoogleOAuthService;
  let rolesService: RolesService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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
  };

  const mockRolesService = {
    getDefaultRole: jest.fn().mockResolvedValue({ id: 'role-cashier-id', name: 'Cashier' }),
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
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully and dispatch verification', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'rahul@example.com',
        username: 'rahul_c',
        role: { name: 'Cashier' },
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
  });

  describe('login', () => {
    it('should authenticate valid credentials and issue session cookie', async () => {
      const mockUser = {
        id: 'user-1',
        username: 'rahul_c',
        email: 'rahul@example.com',
        passwordHash: 'argon2id$hashed',
        fullName: 'Rahul Sharma',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        role: {
          name: 'Cashier',
          rolePermissions: [{ permission: { code: 'create_sale' } }],
        },
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValue(true);

      const mockReq: any = { ip: '127.0.0.1', headers: {} };
      const mockRes: any = {};

      const result = await service.login(
        { identifier: 'rahul@example.com', password: 'Password123!' },
        mockReq,
        mockRes,
      );

      expect(result.message).toBe('Login successful');
      expect(result.user.username).toBe('rahul_c');
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
      mockPasswordService.verifyPassword.mockResolvedValue(false); // Invalid password

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
  });

  describe('googleLogin', () => {
    it('should authenticate verified Google OAuth user and create session', async () => {
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
        role: {
          name: 'Cashier',
          rolePermissions: [],
        },
      };

      mockPrisma.user.findFirst.mockResolvedValue(existingUser);

      const mockReq: any = { headers: {} };
      const mockRes: any = {};

      const result = await service.googleLogin({ idToken: 'valid-google-id-token' }, mockReq, mockRes);
      expect(result.message).toBe('Google authentication successful');
      expect(result.user.email).toBe('googleuser@gmail.com');
      expect(mockSessionService.setSessionCookie).toHaveBeenCalled();
    });
  });
});
