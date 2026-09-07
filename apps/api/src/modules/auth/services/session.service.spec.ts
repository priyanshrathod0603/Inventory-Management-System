import { Test, TestingModule } from '@nestjs/testing';
import { SessionService, SESSION_COOKIE_NAME } from './session.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';

/**
 * SessionService Tests — Universal Admin Access Model
 *
 * validateSession now loads all permissions from the permissions table (not via role join).
 * User payload contains accessLevel: 'Admin' (fixed constant) instead of a DB role.
 */
describe('SessionService', () => {
  let service: SessionService;

  const mockPrisma = {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    permission: {
      findMany: jest.fn().mockResolvedValue([
        { code: 'create_sale' },
        { code: 'view_products' },
        { code: 'manage_users' },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    jest.clearAllMocks();
    // Re-set the permission mock after clearAllMocks
    mockPrisma.permission.findMany.mockResolvedValue([
      { code: 'create_sale' },
      { code: 'view_products' },
      { code: 'manage_users' },
    ]);
  });

  it('should generate a 128-character hex session ID', () => {
    const sessionId = service.generateSessionId();
    expect(sessionId).toBeDefined();
    expect(sessionId.length).toBe(128);
    expect(sessionId).toMatch(/^[0-9a-f]{128}$/);
  });

  it('should create a session in database with correct expiry', async () => {
    mockPrisma.session.create.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue({});

    const userId = '11111111-1111-1111-1111-111111111111';
    const result = await service.createSession(userId, '127.0.0.1', 'Mozilla', false);

    expect(result.sessionId).toBeDefined();
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(mockPrisma.session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: result.sessionId,
          userId,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla',
        }),
      }),
    );
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { lastLoginAt: expect.any(Date) },
    });
  });

  it('should validate session and return user with full permission catalog (universal access)', async () => {
    const validSession = {
      id: 'session-id-123',
      userId: 'user-id-123',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour in future
      createdAt: new Date(),
      user: {
        id: 'user-id-123',
        username: 'ims_user',
        email: 'user@example.com',
        fullName: 'IMS User',
        phone: null,
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        avatarUrl: null,
      },
    };

    mockPrisma.session.findUnique.mockResolvedValue(validSession);
    mockPrisma.permission.findMany.mockResolvedValue([
      { code: 'create_sale' },
      { code: 'view_products' },
      { code: 'manage_users' },
    ]);

    const result = await service.validateSession('session-id-123');
    expect(result).toBeDefined();
    expect(result?.user.username).toBe('ims_user');
    expect(result?.user.accessLevel).toBe('Admin');
    expect(result?.user.permissions).toEqual(['create_sale', 'view_products', 'manage_users']);
    // No role field, no roleId field
    expect((result?.user as any).role).toBeUndefined();
    expect((result?.user as any).roleId).toBeUndefined();
  });

  it('should return null and revoke expired session', async () => {
    const expiredSession = {
      id: 'expired-session-id',
      userId: 'user-id-123',
      expiresAt: new Date(Date.now() - 3600000), // 1 hour in past
      createdAt: new Date(),
      user: {
        id: 'user-id-123',
        isActive: true,
        isDeleted: false,
      },
    };

    mockPrisma.session.findUnique.mockResolvedValue(expiredSession);
    mockPrisma.session.delete.mockResolvedValue({});

    const result = await service.validateSession('expired-session-id');
    expect(result).toBeNull();
    expect(mockPrisma.session.delete).toHaveBeenCalledWith({
      where: { id: 'expired-session-id' },
    });
  });

  it('should return null for inactive or deleted user', async () => {
    const inactiveUserSession = {
      id: 'session-id-inactive',
      userId: 'user-id-123',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      user: {
        id: 'user-id-123',
        isActive: false, // Inactive
        isDeleted: false,
      },
    };

    mockPrisma.session.findUnique.mockResolvedValue(inactiveUserSession);

    const result = await service.validateSession('session-id-inactive');
    expect(result).toBeNull();
  });

  it('should set secure session cookie on response', () => {
    const mockRes = {
      cookie: jest.fn(),
    } as unknown as Response;

    const expiresAt = new Date(Date.now() + 3600000);
    service.setSessionCookie(mockRes, 'session-token-abc', expiresAt);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      'session-token-abc',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        expires: expiresAt,
      }),
    );
  });

  it('should clear session cookie on response', () => {
    const mockRes = {
      clearCookie: jest.fn(),
    } as unknown as Response;

    service.clearSessionCookie(mockRes);
    expect(mockRes.clearCookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      }),
    );
  });
});
