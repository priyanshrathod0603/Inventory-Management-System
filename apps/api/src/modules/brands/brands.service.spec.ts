import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BrandsService', () => {
  let service: BrandsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    brand: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a brand successfully', async () => {
      mockPrismaService.brand.findFirst.mockResolvedValue(null);
      mockPrismaService.brand.create.mockResolvedValue({
        id: 'brand-1',
        name: 'Amul',
        description: 'Dairy products',
      });

      const result = await service.create({ name: 'Amul', description: 'Dairy products' });
      expect(result.name).toBe('Amul');
      expect(mockPrismaService.brand.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if brand name exists', async () => {
      mockPrismaService.brand.findFirst.mockResolvedValue({ id: 'brand-1', name: 'Amul' });

      await expect(service.create({ name: 'Amul' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return brand by id', async () => {
      mockPrismaService.brand.findFirst.mockResolvedValue({ id: 'brand-1', name: 'Amul' });

      const result = await service.findOne('brand-1');
      expect(result.name).toBe('Amul');
    });

    it('should throw NotFoundException if brand not found', async () => {
      mockPrismaService.brand.findFirst.mockResolvedValue(null);

      await expect(service.findOne('brand-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete a brand', async () => {
      mockPrismaService.brand.findFirst.mockResolvedValue({ id: 'brand-1', name: 'Amul' });
      mockPrismaService.brand.update.mockResolvedValue({ id: 'brand-1', isDeleted: true, isActive: false });

      const result = await service.remove('brand-1');
      expect(result.isDeleted).toBe(true);
      expect(mockPrismaService.brand.update).toHaveBeenCalledWith({
        where: { id: 'brand-1' },
        data: { isDeleted: true, isActive: false },
      });
    });
  });
});
