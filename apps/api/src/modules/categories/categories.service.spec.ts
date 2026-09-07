import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category with auto-generated slug', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue({
        id: 'cat-1',
        name: 'Cold Beverages',
        slug: 'cold-beverages',
        description: 'Drinks',
        parentId: null,
      });

      const result = await service.create({ name: 'Cold Beverages', description: 'Drinks' });
      expect(result.slug).toBe('cold-beverages');
      expect(mockPrismaService.category.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if category name already exists', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1', name: 'Cold Beverages' });

      await expect(service.create({ name: 'Cold Beverages' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1', name: 'Snacks' });

      const result = await service.findOne('cat-1');
      expect(result.name).toBe('Snacks');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('cat-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1', name: 'Snacks' });
      mockPrismaService.category.update.mockResolvedValue({ id: 'cat-1', isDeleted: true, isActive: false });

      const result = await service.remove('cat-1');
      expect(result.isDeleted).toBe(true);
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: { isDeleted: true, isActive: false },
      });
    });
  });
});
