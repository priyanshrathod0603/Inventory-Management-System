import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SessionService } from './services/session.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('Phase 6 Security & Access Control Suite', () => {
  let sessionGuard: SessionAuthGuard;
  let permissionsGuard: PermissionsGuard;
  let sessionService: jest.Mocked<SessionService>;
  let usersService: UsersService;
  let reflector: Reflector;
  let mockPrisma: any;

  beforeEach(async () => {
    reflector = new Reflector();
    sessionService = {
      validateSession: jest.fn(),
    } as any;

    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    sessionGuard = new SessionAuthGuard(reflector, sessionService);
    permissionsGuard = new PermissionsGuard(reflector);
    usersService = new UsersService(mockPrisma as any);
  });

  const createMockContext = (request: any, isPublic = false, requiredPermissions?: string[]): ExecutionContext => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'isPublic') return isPublic;
      if (key === 'permissions') return requiredPermissions;
      return undefined;
    });

    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
    } as unknown as ExecutionContext;
  };

  describe('Principle: No Login = No Protected Data', () => {
    it('SECURITY TEST 1: Request with no session cookie must be rejected with 401', async () => {
      const request = { cookies: {}, headers: {} };
      const context = createMockContext(request, false);

      await expect(sessionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('SECURITY TEST 2: Request with fake or expired session ID must be rejected with 401', async () => {
      sessionService.validateSession.mockResolvedValue(null);
      const request = { cookies: { sms_session: 'fake-unauthorized-session-id' }, headers: {} };
      const context = createMockContext(request, false);

      await expect(sessionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('SECURITY TEST 3: Deactivated user with valid session token must be blocked with 401', async () => {
      sessionService.validateSession.mockResolvedValue({
        session: { id: 'sess-1', userId: 'u-1', expiresAt: new Date(), createdAt: new Date() },
        user: { id: 'u-1', isActive: false, isDeleted: false } as any,
      });

      const request = { cookies: { sms_session: 'sess-1' }, headers: {} };
      const context = createMockContext(request, false);

      await expect(sessionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('SECURITY TEST 3A: Valid database session token sent via Authorization: Bearer must be REJECTED with 401 (Cookie-only enforcement)', async () => {
      const request = {
        cookies: {},
        headers: { authorization: 'Bearer valid-active-session-token-128char-hex' },
      };
      const context = createMockContext(request, false);

      await expect(sessionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(sessionService.validateSession).not.toHaveBeenCalled();
    });

    it('SECURITY TEST 3B: Revoked/logged-out session token must be REJECTED with 401 upon reuse', async () => {
      // Simulate session deleted from database post-logout
      sessionService.validateSession.mockResolvedValue(null);

      const request = { cookies: { sms_session: 'revoked-post-logout-session-id' }, headers: {} };
      const context = createMockContext(request, false);

      await expect(sessionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Principle: URL Is Never An Authorization Mechanism (IDOR & URL Tampering)', () => {
    it('SECURITY TEST 4: User A cannot access User B resource by simply altering route UUID (IDOR rejection)', async () => {
      const userA = {
        id: '11111111-1111-1111-1111-111111111111',
        username: 'user_a',
        role: 'Cashier',
        permissions: ['create_sale', 'view_products'],
      };
      const userBId = '22222222-2222-2222-2222-222222222222'; // Victim's ID in URL

      await expect(usersService.getUserById(userBId, userA)).rejects.toThrow(ForbiddenException);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('SECURITY TEST 5: User modifying client-side permissions payload cannot bypass PermissionsGuard', () => {
      // User claims permissions in client payload, but server guard checks required permission
      const userWithMissingPermission = {
        id: 'u-1',
        role: 'Cashier',
        permissions: ['create_sale', 'view_products'], // lacks 'manage_settings'
      };

      const request = { user: userWithMissingPermission };
      const context = createMockContext(request, false, ['manage_settings']);

      expect(() => permissionsGuard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('SECURITY TEST 6: Super Administrator is authorized across resources', async () => {
      const adminUser = {
        id: '99999999-9999-9999-9999-999999999999',
        username: 'admin',
        role: 'Admin',
        permissions: ['manage_users'],
      };
      const userBId = '22222222-2222-2222-2222-222222222222';

      mockPrisma.user.findUnique.mockResolvedValue({
        id: userBId,
        username: 'user_b',
        email: 'user_b@example.com',
        fullName: 'User B',
        phone: null,
        roleId: 'r2',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        avatarUrl: null,
        createdAt: new Date(),
        role: { name: 'Staff', rolePermissions: [] },
      });

      const result = await usersService.getUserById(userBId, adminUser);
      expect(result.id).toBe(userBId);
      expect(result.username).toBe('user_b');
    });
  });
});
