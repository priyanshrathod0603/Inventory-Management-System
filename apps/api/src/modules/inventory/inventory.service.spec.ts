import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { AdjustmentType, AdjustmentReasonCategory } from './dto/create-adjustment.dto';
import { Prisma } from '@prisma/client';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockPrismaService: any = {
    product: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    warehouse: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    warehouseInventory: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    stockAdjustment: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    stockTransfer: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAdjustment', () => {
    it('should successfully increase stock and create adjustment + movement', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Sugar 1kg',
        unit: 'Kg',
        currentStock: new Prisma.Decimal(20),
      });
      mockPrismaService.warehouse.findFirst.mockResolvedValue({
        id: 'wh-1',
        name: 'Main Storefront',
      });
      mockPrismaService.warehouseInventory.findUnique.mockResolvedValue({
        quantity: new Prisma.Decimal(20),
      });
      mockPrismaService.product.update.mockResolvedValue({
        id: 'prod-1',
        currentStock: new Prisma.Decimal(25),
      });
      mockPrismaService.stockAdjustment.create.mockResolvedValue({
        id: 'adj-1',
        adjustmentNumber: 'ADJ-2026-000001',
        quantity: new Prisma.Decimal(5),
        newStock: new Prisma.Decimal(25),
      });

      const result = await service.createAdjustment(
        {
          productId: 'prod-1',
          warehouseId: 'wh-1',
          adjustmentType: AdjustmentType.INCREASE,
          quantity: 5,
          reasonCategory: AdjustmentReasonCategory.PHYSICAL_COUNT_DISCREPANCY,
          notes: 'Audit recount found extra 5kg',
        },
        'user-1',
      );

      expect(result.id).toBe('adj-1');
      expect(mockPrismaService.stockMovement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          movementType: 'ADJUSTMENT_INCREASE',
          beforeStock: new Prisma.Decimal(20),
          afterStock: new Prisma.Decimal(25),
        }),
      });
    });

    it('should throw BadRequestException when adjustment decrease exceeds available stock', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Sugar 1kg',
        unit: 'Kg',
        currentStock: new Prisma.Decimal(3),
      });
      mockPrismaService.warehouse.findFirst.mockResolvedValue({
        id: 'wh-1',
        name: 'Main Storefront',
      });
      mockPrismaService.warehouseInventory.findUnique.mockResolvedValue({
        quantity: new Prisma.Decimal(3),
      });

      await expect(
        service.createAdjustment(
          {
            productId: 'prod-1',
            warehouseId: 'wh-1',
            adjustmentType: AdjustmentType.DECREASE,
            quantity: 5,
            reasonCategory: AdjustmentReasonCategory.DAMAGED_GOODS,
            notes: 'Damaged packages',
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createTransfer', () => {
    it('should reject transfer when source and destination are the same', async () => {
      await expect(
        service.createTransfer(
          {
            fromWarehouseId: 'wh-1',
            toWarehouseId: 'wh-1',
            items: [{ productId: 'prod-1', quantity: 2 }],
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
