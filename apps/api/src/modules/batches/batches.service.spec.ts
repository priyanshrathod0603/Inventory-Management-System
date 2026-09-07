import { Test, TestingModule } from '@nestjs/testing';
import { BatchesService } from './batches.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('BatchesService', () => {
  let service: BatchesService;
  let prisma: PrismaService;

  const mockPrismaService: any = {
    product: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    warehouse: {
      findFirst: jest.fn(),
    },
    productBatch: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BatchesService>(BatchesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create batch and calculate status', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 90);

      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Paracetamol 500mg',
        hasBatchTracking: false,
      });
      mockPrismaService.warehouse.findFirst.mockResolvedValue({
        id: 'wh-1',
        name: 'Main Storefront',
      });
      mockPrismaService.productBatch.create.mockResolvedValue({
        id: 'batch-1',
        batchNumber: 'LOT-991',
        quantity: new Prisma.Decimal(100),
        expiryDate: futureDate,
        status: 'ACTIVE',
      });

      const result = await service.create({
        productId: 'prod-1',
        warehouseId: 'wh-1',
        batchNumber: 'LOT-991',
        expiryDate: futureDate.toISOString(),
        quantity: 100,
        purchasePrice: 15,
      });

      expect(result.id).toBe('batch-1');
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { hasBatchTracking: true },
      });
    });

    it('should throw BadRequestException if mfgDate is after expiryDate', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({ id: 'prod-1' });
      mockPrismaService.warehouse.findFirst.mockResolvedValue({ id: 'wh-1' });

      await expect(
        service.create({
          productId: 'prod-1',
          warehouseId: 'wh-1',
          batchNumber: 'LOT-FAIL',
          mfgDate: '2027-01-01',
          expiryDate: '2026-01-01',
          quantity: 10,
          purchasePrice: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
