import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService: any = {
    product: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
    },
    brand: {
      findFirst: jest.fn(),
    },
    warehouse: {
      findFirst: jest.fn(),
    },
    warehouseInventory: {
      create: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create product with opening stock and log StockMovement', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1', name: 'Grains' });
      mockPrismaService.warehouse.findFirst.mockResolvedValue({ id: 'wh-1', name: 'Main' });
      mockPrismaService.product.create.mockResolvedValue({
        id: 'prod-1',
        name: 'Basmati Rice 5kg',
        sku: 'SKU-1049',
        barcode: '8901024001',
        currentStock: new Prisma.Decimal(50),
        minStockAlert: new Prisma.Decimal(10),
      });

      const result = await service.create(
        {
          name: 'Basmati Rice 5kg',
          sku: 'SKU-1049',
          barcode: '8901024001',
          categoryId: 'cat-1',
          unit: 'Bags',
          sellingPrice: 580,
          purchasePrice: 450,
          initialOpeningStock: 50,
          warehouseId: 'wh-1',
        },
        'user-admin-id',
      );

      expect(result.stockStatus).toBe('IN_STOCK');
      expect(mockPrismaService.warehouseInventory.create).toHaveBeenCalledWith({
        data: {
          warehouseId: 'wh-1',
          productId: 'prod-1',
          quantity: new Prisma.Decimal(50),
        },
      });
      expect(mockPrismaService.stockMovement.create).toHaveBeenCalledWith({
        data: {
          productId: 'prod-1',
          warehouseId: 'wh-1',
          movementType: 'OPENING',
          quantity: new Prisma.Decimal(50),
          beforeStock: new Prisma.Decimal(0),
          afterStock: new Prisma.Decimal(50),
          referenceType: 'PRODUCT',
          referenceId: 'prod-1',
          referenceNumber: 'SKU-1049',
          userId: 'user-admin-id',
          reason: 'Initial opening stock upon product creation',
        },
      });
    });

    it('should throw ConflictException on duplicate SKU', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({ id: 'prod-1', sku: 'SKU-1049' });

      await expect(
        service.create(
          {
            name: 'Basmati Rice 5kg',
            sku: 'SKU-1049',
            categoryId: 'cat-1',
            unit: 'Bags',
            sellingPrice: 580,
          },
          'user-id',
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByBarcode', () => {
    it('should return product by barcode', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Basmati Rice 5kg',
        barcode: '8901024001',
        currentStock: new Prisma.Decimal(5),
        minStockAlert: new Prisma.Decimal(10),
      });

      const result = await service.findByBarcode('8901024001');
      expect(result.stockStatus).toBe('LOW_STOCK');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.findByBarcode('99999999')).rejects.toThrow(NotFoundException);
    });
  });
});
