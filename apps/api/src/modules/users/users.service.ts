import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * IMS Universal Admin Access Model:
 * All authenticated users have full system access.
 * IDOR protection is maintained: a user can only access their own profile,
 * or any profile if they possess the 'manage_users' capability (which all users have).
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves user profile with IDOR / authorization check.
   * Universal access: a user can always fetch their own profile.
   * Since all authenticated users have 'manage_users' permission,
   * all authenticated users can also access any user profile.
   */
  async getUserById(targetUserId: string, requestingUser: any) {
    if (!targetUserId) {
      throw new NotFoundException('User ID is required');
    }

    // IDOR / Resource ownership verification:
    const isSelf = requestingUser.id === targetUserId;
    const hasManageUsers =
      (requestingUser.permissions && requestingUser.permissions.includes('manage_users'));

    if (!isSelf && !hasManageUsers) {
      throw new ForbiddenException(
        'Access denied: You are not authorized to view this user profile.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found');
    }

    // Universal Admin Access: load full permission catalog
    const allPermissions = await this.prisma.permission.findMany({ select: { code: true } });
    const permissions = allPermissions.map((p) => p.code);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      accessLevel: 'Admin' as const,
      permissions,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
