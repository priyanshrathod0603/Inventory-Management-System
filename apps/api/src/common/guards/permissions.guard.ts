import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * PermissionsGuard — Server-authoritative permission enforcement.
 *
 * IMS Universal Admin Access Model:
 * Every authenticated user receives the full permission catalog in their session.
 * Therefore, any authenticated user will pass all permission checks naturally.
 * This guard remains in place to:
 *   1. Enforce that a valid authenticated session exists (request.user is set)
 *   2. Verify that the required permission code is a known system permission
 *   3. Provide an auditable access control surface for future policy changes
 *
 * The guard still checks user.permissions against requiredPermissions —
 * since all authenticated users have the complete catalog, all will pass.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException('Access denied. Required permissions not found.');
    }

    // All authenticated users have the full permission catalog.
    // This check validates the permission exists and is granted.
    const hasAllPermissions = requiredPermissions.every((requiredPerm) =>
      user.permissions.includes(requiredPerm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Access denied. Insufficient permissions for this resource.');
    }

    return true;
  }
}
