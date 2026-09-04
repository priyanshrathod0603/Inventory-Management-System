import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UsersService (Security & IDOR Tests)', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
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
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should allow user to fetch their own profile (isSelf = true)', async () => {
    const userId = '11111111-1111-1111-1111-111111111111';
    const requestingUser = { id: userId, role: 'Cashier', permissions: ['create_sale'] };

    mockPrisma.user.findUnique.mockResolvedValue({
      id: userId,
      username: 'cashier1',
      email: 'c1@example.com',
      fullName: 'Rahul S',
      phone: null,
      roleId: 'r1',
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
      avatarUrl: null,
      createdAt: new Date(),
      role: {
        name: 'Cashier',
        rolePermissions: [{ permission: { code: 'create_sale' } }],
      },
    });

    const result = await service.getUserById(userId, requestingUser);
    expect(result.id).toBe(userId);
    expect(result.username).toBe('cashier1');
  });

  it('SECURITY / IDOR: should reject when standard user modifies URL/ID to access another user', async () => {
    const userA = { id: '11111111-1111-1111-1111-111111111111', role: 'Cashier', permissions: ['create_sale'] };
    const userBId = '22222222-2222-2222-2222-222222222222'; // Target victim user

    await expect(service.getUserById(userBId, userA)).rejects.toThrow(ForbiddenException);
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('should allow Admin to view any user profile', async () => {
    const adminUser = { id: '99999999-9999-9999-9999-999999999999', role: 'Admin', permissions: ['manage_users'] };
    const userBId = '22222222-2222-2222-2222-222222222222';

    mockPrisma.user.findUnique.mockResolvedValue({
      id: userBId,
      username: 'target_user',
      email: 'target@example.com',
      fullName: 'Target User',
      phone: null,
      roleId: 'r2',
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
      avatarUrl: null,
      createdAt: new Date(),
      role: {
        name: 'Staff',
        rolePermissions: [],
      },
    });

    const result = await service.getUserById(userBId, adminUser);
    expect(result.id).toBe(userBId);
  });

  it('should throw NotFoundException if requested user does not exist in database', async () => {
    const adminUser = { id: '99999999-9999-9999-9999-999999999999', role: 'Admin', permissions: ['manage_users'] };
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getUserById('non-existent-uuid', adminUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
