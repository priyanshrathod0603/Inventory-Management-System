import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

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

  it('should allow access if no permissions are required', () => {
    const context = createMockContext({}, undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow Admin full access even if specific permission is missing', () => {
    const context = createMockContext(
      { role: 'Admin', permissions: [] },
      ['create_product', 'delete_product'],
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has all required permissions', () => {
    const context = createMockContext(
      { role: 'Cashier', permissions: ['create_sale', 'view_products'] },
      ['create_sale', 'view_products'],
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user lacks one of the required permissions', () => {
    const context = createMockContext(
      { role: 'Cashier', permissions: ['create_sale'] },
      ['create_sale', 'delete_product'],
    );
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if no user is present on request', () => {
    const context = createMockContext(undefined, ['create_sale']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
