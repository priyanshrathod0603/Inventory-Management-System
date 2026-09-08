import { SessionAuthGuard } from './session-auth.guard';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../../modules/auth/services/session.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('SessionAuthGuard', () => {
  let guard: SessionAuthGuard;
  let reflector: Reflector;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    reflector = new Reflector();
    sessionService = {
      validateSession: jest.fn(),
    } as any;

    guard = new SessionAuthGuard(reflector, sessionService);
  });

  const createMockContext = (request: any, isPublic = false): ExecutionContext => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
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

  it('should allow public routes without authentication', async () => {
    const context = createMockContext({}, true);
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when no session cookie is provided', async () => {
    const context = createMockContext({ cookies: {}, headers: {} }, false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should authenticate with valid session cookie and attach user to request', async () => {
    const mockUser = {
      id: 'u1',
      username: 'ims_user',
      email: 'user@example.com',
      fullName: 'IMS User',
      phone: null,
      accessLevel: 'Admin' as const,
      permissions: ['create_sale', 'manage_users'],
      isEmailVerified: true,
      isActive: true,
      isDeleted: false,
      avatarUrl: null,
      isOnboardingCompleted: true,
    };

    const mockSessionData = {
      session: {
        id: 'valid-sess-id',
        userId: 'u1',
        expiresAt: new Date(Date.now() + 10000),
        createdAt: new Date(),
      },
      user: mockUser,
    };

    sessionService.validateSession.mockResolvedValue(mockSessionData);

    const request: any = {
      cookies: { sms_session: 'valid-sess-id' },
      headers: {},
    };

    const context = createMockContext(request, false);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(mockUser);
    expect(request.sessionId).toBe('valid-sess-id');
  });

  it('SECURITY TEST: should REJECT valid session token sent via Authorization: Bearer without cookie (401)', async () => {
    const request: any = {
      cookies: {},
      headers: { authorization: 'Bearer valid-database-session-token' },
    };

    const context = createMockContext(request, false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(sessionService.validateSession).not.toHaveBeenCalled();
  });

  it('SECURITY TEST: should REJECT invalid Bearer token format without cookie (401)', async () => {
    const request: any = {
      cookies: {},
      headers: { authorization: 'Bearer invalid-token' },
    };

    const context = createMockContext(request, false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(sessionService.validateSession).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when session is invalid or expired', async () => {
    sessionService.validateSession.mockResolvedValue(null);

    const request: any = {
      cookies: { sms_session: 'invalid-or-expired' },
      headers: {},
    };

    const context = createMockContext(request, false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user account is deactivated', async () => {
    const mockSessionData = {
      session: { id: 's1', userId: 'u1', expiresAt: new Date(), createdAt: new Date() },
      user: {
        id: 'u1',
        username: 'inactive_user',
        isActive: false, // Inactive
        isDeleted: false,
      } as any,
    };

    sessionService.validateSession.mockResolvedValue(mockSessionData);

    const request: any = {
      cookies: { sms_session: 's1' },
      headers: {},
    };

    const context = createMockContext(request, false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
