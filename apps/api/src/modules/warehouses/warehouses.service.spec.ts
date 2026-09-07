import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: PrismaService;

  const mockPrismaService: any = {
    warehouse: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse successfully', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);
      mockPrismaService.warehouse.create.mockResolvedValue({
        id: 'wh-1',
        name: 'Main Storefront',
        code: 'WH-MAIN',
        isDefault: true,
      });

      const result = await service.create({
        name: 'Main Storefront',
        code: 'WH-MAIN',
        isDefault: true,
      });

      expect(result.code).toBe('WH-MAIN');
      expect(mockPrismaService.warehouse.updateMany).toHaveBeenCalledWith({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    });

    it('should throw ConflictException on duplicate name', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValueOnce({ id: 'wh-1', name: 'Main' });

      await expect(
        service.create({ name: 'Main', code: 'WH-1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return warehouse by id', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 'wh-1', name: 'Main' });

      const result = await service.findOne('wh-1');
      expect(result.name).toBe('Main');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.findOne('wh-999')).rejects.toThrow(NotFoundException);
    });
  });
});
