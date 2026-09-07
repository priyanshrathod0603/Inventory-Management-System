import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

/**
 * UsersService Tests — Universal Admin Access Model
 *
 * IDOR protection is retained: user can access own profile always.
 * manage_users permission (which all authenticated users have) grants cross-user access.
 */
describe('UsersService (Security & IDOR Tests)', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    permission: {
      findMany: jest.fn().mockResolvedValue([
        { code: 'create_sale' },
        { code: 'manage_users' },
        { code: 'view_products' },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
    mockPrisma.permission.findMany.mockResolvedValue([
      { code: 'create_sale' },
      { code: 'manage_users' },
      { code: 'view_products' },
    ]);
  });

  it('should allow user to fetch their own profile (isSelf = true)', async () => {
    const userId = '11111111-1111-1111-1111-111111111111';
    const requestingUser = {
      id: userId,
      accessLevel: 'Admin',
      permissions: ['create_sale', 'manage_users'],
    };

    mockPrisma.user.findUnique.mockResolvedValue({
      id: userId,
      username: 'user1',
      email: 'c1@example.com',
      fullName: 'Rahul S',
      phone: null,
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
      avatarUrl: null,
      createdAt: new Date(),
    });

    const result = await service.getUserById(userId, requestingUser);
    expect(result.id).toBe(userId);
    expect(result.username).toBe('user1');
    expect(result.accessLevel).toBe('Admin');
  });

  it('SECURITY / IDOR: should reject when user has no manage_users permission and targets another user', async () => {
    const userA = {
      id: '11111111-1111-1111-1111-111111111111',
      accessLevel: 'Admin',
      permissions: [], // empty — no manage_users
    };
    const userBId = '22222222-2222-2222-2222-222222222222'; // Target victim user

    await expect(service.getUserById(userBId, userA)).rejects.toThrow(ForbiddenException);
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('should allow user with manage_users permission to view any profile (universal access)', async () => {
    const adminUser = {
      id: '99999999-9999-9999-9999-999999999999',
      accessLevel: 'Admin',
      permissions: ['manage_users', 'create_sale'],
    };
    const userBId = '22222222-2222-2222-2222-222222222222';

    mockPrisma.user.findUnique.mockResolvedValue({
      id: userBId,
      username: 'target_user',
      email: 'target@example.com',
      fullName: 'Target User',
      phone: null,
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
      avatarUrl: null,
      createdAt: new Date(),
    });

    const result = await service.getUserById(userBId, adminUser);
    expect(result.id).toBe(userBId);
    expect(result.accessLevel).toBe('Admin');
  });

  it('should throw NotFoundException if requested user does not exist in database', async () => {
    const requestingUser = {
      id: '99999999-9999-9999-9999-999999999999',
      accessLevel: 'Admin',
      permissions: ['manage_users'],
    };
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getUserById('non-existent-uuid', requestingUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
