import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

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

    // Admin role has implicit full bypass if configured, or check exact permissions
    if (user.role === 'Admin') {
      return true;
    }

    const hasAllPermissions = requiredPermissions.every((requiredPerm) =>
      user.permissions.includes(requiredPerm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Access denied. Insufficient permissions for this resource.');
    }

    return true;
  }
}
