import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves user profile with strict IDOR / authorization check.
   * A user can only fetch their own profile unless they possess 'manage_users' permission.
   */
  async getUserById(targetUserId: string, requestingUser: any) {
    if (!targetUserId) {
      throw new NotFoundException('User ID is required');
    }

    // IDOR / Resource ownership verification:
    const isSelf = requestingUser.id === targetUserId;
    const hasAdminPrivilege =
      requestingUser.role === 'Admin' ||
      (requestingUser.permissions && requestingUser.permissions.includes('manage_users'));

    if (!isSelf && !hasAdminPrivilege) {
      throw new ForbiddenException(
        'Access denied: You are not authorized to view this user profile.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found');
    }

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.code);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      roleId: user.roleId,
      role: user.role.name,
      permissions,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
