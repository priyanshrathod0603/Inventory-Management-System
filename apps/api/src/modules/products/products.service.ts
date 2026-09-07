import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto, StockStatusFilter } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateStockStatus(currentStock: number, minStockAlert: number): string {
    if (currentStock <= 0) {
      return 'OUT_OF_STOCK';
    }
    if (currentStock <= minStockAlert) {
      return 'LOW_STOCK';
    }
    return 'IN_STOCK';
  }

  async create(createDto: CreateProductDto, userId: string) {
    const sku = createDto.sku.trim().toUpperCase();
    const barcode = createDto.barcode ? createDto.barcode.trim() : null;

    // 1. Check SKU uniqueness
    const existingSku = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (existingSku) {
      throw new ConflictException(`Product with SKU "${sku}" already exists.`);
    }

    // 2. Check Barcode uniqueness if provided
    if (barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode },
      });
      if (existingBarcode) {
        throw new ConflictException(`Product with barcode "${barcode}" already exists.`);
      }
    }

    // 3. Verify Category
    const category = await this.prisma.category.findFirst({
      where: { id: createDto.categoryId, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    // 4. Verify Brand if provided
    if (createDto.brandId) {
      const brand = await this.prisma.brand.findFirst({
        where: { id: createDto.brandId, isDeleted: false },
      });
      if (!brand) {
        throw new NotFoundException('Brand not found.');
      }
    }

    const openingStock = createDto.initialOpeningStock ? Number(createDto.initialOpeningStock) : 0;

    // 5. Execute Atomic Creation
    return this.prisma.$transaction(async (tx) => {
      let targetWarehouseId = createDto.warehouseId;

      if (openingStock > 0) {
        if (!targetWarehouseId) {
          // Find default warehouse or any active warehouse
          const defaultWh = await tx.warehouse.findFirst({
            where: { isDefault: true, isActive: true },
          });
          const firstWh = defaultWh || (await tx.warehouse.findFirst({ where: { isActive: true } }));

          if (!firstWh) {
            throw new BadRequestException(
              'No active warehouse found to assign opening stock. Please specify a warehouse or create one first.',
            );
          }
          targetWarehouseId = firstWh.id;
        } else {
          const wh = await tx.warehouse.findFirst({
            where: { id: targetWarehouseId, isActive: true },
          });
          if (!wh) {
            throw new NotFoundException('Specified warehouse not found or inactive.');
          }
        }
      }

      // Create Product Master
      const product = await tx.product.create({
        data: {
          name: createDto.name.trim(),
          sku,
          barcode: barcode || null,
          categoryId: createDto.categoryId,
          brandId: createDto.brandId || null,
          unit: createDto.unit.trim(),
          purchasePrice: new Prisma.Decimal(createDto.purchasePrice ?? 0),
          sellingPrice: new Prisma.Decimal(createDto.sellingPrice),
          mrp: new Prisma.Decimal(createDto.mrp ?? createDto.sellingPrice),
          taxRate: new Prisma.Decimal(createDto.taxRate ?? 0),
          isTaxInclusive: createDto.isTaxInclusive !== undefined ? createDto.isTaxInclusive : true,
          minStockAlert: new Prisma.Decimal(createDto.minStockAlert ?? 5),
          currentStock: new Prisma.Decimal(openingStock),
          hasBatchTracking: createDto.hasBatchTracking || false,
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true } },
        },
      });

      // If opening stock provided, create warehouse inventory and immutable movement
      if (openingStock > 0 && targetWarehouseId) {
        await tx.warehouseInventory.create({
          data: {
            warehouseId: targetWarehouseId,
            productId: product.id,
            quantity: new Prisma.Decimal(openingStock),
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: product.id,
            warehouseId: targetWarehouseId,
            movementType: 'OPENING',
            quantity: new Prisma.Decimal(openingStock),
            beforeStock: new Prisma.Decimal(0),
            afterStock: new Prisma.Decimal(openingStock),
            referenceType: 'PRODUCT',
            referenceId: product.id,
            referenceNumber: product.sku,
            userId,
            reason: 'Initial opening stock upon product creation',
          },
        });
      }

      return {
        ...product,
        stockStatus: this.calculateStockStatus(
          Number(product.currentStock),
          Number(product.minStockAlert),
        ),
      };
    });
  }

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 25,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryId,
      brandId,
      warehouseId,
      stockStatus,
      isActive,
    } = query;

    const where: any = { isDeleted: false };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (warehouseId) {
      where.warehouseInventory = {
        some: { warehouseId },
      };
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true } },
          warehouseInventory: {
            include: {
              warehouse: { select: { id: true, name: true, code: true } },
            },
          },
        },
      }),
    ]);

    const formattedProducts = products.map((p) => {
      const currentStock = Number(p.currentStock);
      const minStockAlert = Number(p.minStockAlert);
      return {
        ...p,
        stockStatus: this.calculateStockStatus(currentStock, minStockAlert),
      };
    });

    // If stockStatus filter is requested in query
    let filteredList = formattedProducts;
    if (stockStatus && stockStatus !== StockStatusFilter.ALL) {
      filteredList = formattedProducts.filter((p) => p.stockStatus === stockStatus);
    }

    return {
      data: filteredList,
      meta: {
        page,
        limit,
        total: stockStatus && stockStatus !== StockStatusFilter.ALL ? filteredList.length : total,
        totalPages: Math.ceil(
          (stockStatus && stockStatus !== StockStatusFilter.ALL ? filteredList.length : total) /
            limit,
        ),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true } },
        warehouseInventory: {
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
          },
        },
        batches: {
          where: { quantity: { gt: 0 } },
          orderBy: { expiryDate: 'asc' },
        },
        stockMovements: {
          take: 10,
          orderBy: { movementDate: 'desc' },
          include: {
            warehouse: { select: { id: true, name: true } },
            user: { select: { id: true, fullName: true, username: true } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    return {
      ...product,
      stockStatus: this.calculateStockStatus(
        Number(product.currentStock),
        Number(product.minStockAlert),
      ),
    };
  }

  async findByBarcode(barcode: string) {
    const cleanBarcode = barcode.trim();
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { barcode: cleanBarcode },
          { sku: { equals: cleanBarcode, mode: 'insensitive' } },
        ],
        isDeleted: false,
        isActive: true,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true } },
        warehouseInventory: {
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
          },
        },
        batches: {
          where: { quantity: { gt: 0 }, status: { not: 'EXPIRED' } },
          orderBy: { expiryDate: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`No active product found matching barcode / SKU "${cleanBarcode}".`);
    }

    return {
      ...product,
      stockStatus: this.calculateStockStatus(
        Number(product.currentStock),
        Number(product.minStockAlert),
      ),
    };
  }

  async update(id: string, updateDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateDto.sku && updateDto.sku.trim().toUpperCase() !== product.sku) {
      const existingSku = await this.prisma.product.findFirst({
        where: {
          sku: updateDto.sku.trim().toUpperCase(),
          id: { not: id },
        },
      });
      if (existingSku) {
        throw new ConflictException(`Product with SKU "${updateDto.sku}" already exists.`);
      }
    }

    if (updateDto.barcode && updateDto.barcode.trim() !== product.barcode) {
      const existingBarcode = await this.prisma.product.findFirst({
        where: {
          barcode: updateDto.barcode.trim(),
          id: { not: id },
        },
      });
      if (existingBarcode) {
        throw new ConflictException(`Product with barcode "${updateDto.barcode}" already exists.`);
      }
    }

    if (updateDto.categoryId && updateDto.categoryId !== product.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateDto.categoryId, isDeleted: false },
      });
      if (!category) {
        throw new NotFoundException('Category not found.');
      }
    }

    if (updateDto.brandId && updateDto.brandId !== product.brandId) {
      const brand = await this.prisma.brand.findFirst({
        where: { id: updateDto.brandId, isDeleted: false },
      });
      if (!brand) {
        throw new NotFoundException('Brand not found.');
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateDto.name ? updateDto.name.trim() : undefined,
        sku: updateDto.sku ? updateDto.sku.trim().toUpperCase() : undefined,
        barcode: updateDto.barcode !== undefined ? updateDto.barcode?.trim() || null : undefined,
        categoryId: updateDto.categoryId ? updateDto.categoryId : undefined,
        brandId: updateDto.brandId !== undefined ? updateDto.brandId : undefined,
        unit: updateDto.unit ? updateDto.unit.trim() : undefined,
        purchasePrice:
          updateDto.purchasePrice !== undefined
            ? new Prisma.Decimal(updateDto.purchasePrice)
            : undefined,
        sellingPrice:
          updateDto.sellingPrice !== undefined
            ? new Prisma.Decimal(updateDto.sellingPrice)
            : undefined,
        mrp: updateDto.mrp !== undefined ? new Prisma.Decimal(updateDto.mrp) : undefined,
        taxRate:
          updateDto.taxRate !== undefined ? new Prisma.Decimal(updateDto.taxRate) : undefined,
        isTaxInclusive:
          updateDto.isTaxInclusive !== undefined ? updateDto.isTaxInclusive : undefined,
        minStockAlert:
          updateDto.minStockAlert !== undefined
            ? new Prisma.Decimal(updateDto.minStockAlert)
            : undefined,
        hasBatchTracking:
          updateDto.hasBatchTracking !== undefined ? updateDto.hasBatchTracking : undefined,
        isActive: updateDto.isActive !== undefined ? updateDto.isActive : undefined,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true } },
        warehouseInventory: {
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
          },
        },
      },
    });

    return {
      ...updated,
      stockStatus: this.calculateStockStatus(
        Number(updated.currentStock),
        Number(updated.minStockAlert),
      ),
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }
}
