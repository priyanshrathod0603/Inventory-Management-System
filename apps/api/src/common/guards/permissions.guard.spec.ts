import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * PermissionsGuard Tests — Universal Admin Access Model
 *
 * All authenticated users have the full permission catalog in their session.
 * The guard enforces:
 *   - No unauthenticated request passes
 *   - Permission code must exist in user.permissions
 *   - No special role bypass — permissions array is the single source of truth
 */
describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  const createMockContext = (user: any, requiredPermissions?: string[]): ExecutionContext => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredPermissions);
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access if no permissions are required (public endpoint)', () => {
    const context = createMockContext({}, undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has all required permissions in their catalog', () => {
    const context = createMockContext(
      {
        accessLevel: 'Admin',
        permissions: ['create_product', 'delete_product', 'view_products'],
      },
      ['create_product', 'delete_product'],
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access for user with full permission catalog (universal model)', () => {
    const context = createMockContext(
      {
        accessLevel: 'Admin',
        permissions: ['create_sale', 'view_products', 'manage_users', 'manage_settings'],
      },
      ['manage_settings'],
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user lacks a required permission', () => {
    // This simulates a compromised/tampered session payload with missing permissions
    const context = createMockContext(
      {
        accessLevel: 'Admin',
        permissions: ['create_sale'], // missing 'delete_product'
      },
      ['create_sale', 'delete_product'],
    );
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if no user is present on request (unauthenticated)', () => {
    const context = createMockContext(undefined, ['create_sale']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user.permissions is missing entirely', () => {
    const context = createMockContext(
      { accessLevel: 'Admin' }, // no permissions array
      ['create_sale'],
    );
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
