import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdjustmentDto, AdjustmentType } from './dto/create-adjustment.dto';
import { CreateTransferDto, TransferStatus } from './dto/create-transfer.dto';
import { UpdateTransferStatusDto } from './dto/update-transfer-status.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { InventoryOverviewQueryDto } from './dto/inventory-overview-query.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';
import { StockStatusFilter } from '../products/dto/product-query.dto';

@Injectable()
export class InventoryService {
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

  // -------------------------------------------------------------
  // 1. INVENTORY OVERVIEW & VALUATION
  // -------------------------------------------------------------
  async getOverview(query: InventoryOverviewQueryDto) {
    const {
      page = 1,
      limit = 25,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      warehouseId,
      categoryId,
      stockStatus,
    } = query;

    const where: any = { isDeleted: false };

    if (categoryId) {
      where.categoryId = categoryId;
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

    const [totalProducts, products, allInventory] = await Promise.all([
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
            where: warehouseId ? { warehouseId } : undefined,
            include: {
              warehouse: { select: { id: true, name: true, code: true } },
            },
          },
        },
      }),
      // Aggregate all active inventory for KPI valuation
      this.prisma.product.findMany({
        where: { isDeleted: false },
        select: {
          currentStock: true,
          purchasePrice: true,
          sellingPrice: true,
          minStockAlert: true,
        },
      }),
    ]);

    // KPI Aggregations
    let totalValuationCost = 0;
    let totalValuationRetail = 0;
    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const item of allInventory) {
      const stock = Number(item.currentStock);
      const cost = Number(item.purchasePrice);
      const retail = Number(item.sellingPrice);
      const minAlert = Number(item.minStockAlert);

      totalUnits += stock;
      totalValuationCost += stock * cost;
      totalValuationRetail += stock * retail;

      if (stock <= 0) {
        outOfStockCount++;
      } else if (stock <= minAlert) {
        lowStockCount++;
      }
    }

    const formattedProducts = products.map((p) => {
      const currentStock = Number(p.currentStock);
      const minStockAlert = Number(p.minStockAlert);
      return {
        ...p,
        stockStatus: this.calculateStockStatus(currentStock, minStockAlert),
      };
    });

    let filteredList = formattedProducts;
    if (stockStatus && stockStatus !== StockStatusFilter.ALL) {
      filteredList = formattedProducts.filter((p) => p.stockStatus === stockStatus);
    }

    return {
      data: {
        summary: {
          totalValuationCost: Number(totalValuationCost.toFixed(2)),
          totalValuationRetail: Number(totalValuationRetail.toFixed(2)),
          totalUnits: Number(totalUnits.toFixed(3)),
          lowStockCount,
          outOfStockCount,
          totalProductsCount: allInventory.length,
        },
        products: filteredList,
      },
      meta: {
        page,
        limit,
        total: stockStatus && stockStatus !== StockStatusFilter.ALL ? filteredList.length : totalProducts,
        totalPages: Math.ceil(
          (stockStatus && stockStatus !== StockStatusFilter.ALL ? filteredList.length : totalProducts) /
            limit,
        ),
      },
    };
  }

  // -------------------------------------------------------------
  // 2. IMMUTABLE STOCK MOVEMENTS LEDGER
  // -------------------------------------------------------------
  async getMovements(query: StockMovementQueryDto) {
    const {
      page = 1,
      limit = 25,
      productId,
      warehouseId,
      movementType,
      startDate,
      endDate,
      sortBy = 'movementDate',
      sortOrder = 'desc',
    } = query;

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (movementType) {
      where.movementType = movementType;
    }

    if (startDate || endDate) {
      where.movementDate = {};
      if (startDate) {
        where.movementDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.movementDate.lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [total, movements] = await Promise.all([
      this.prisma.stockMovement.count({ where }),
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          product: {
            select: { id: true, name: true, sku: true, unit: true },
          },
          warehouse: {
            select: { id: true, name: true, code: true },
          },
          user: {
            select: { id: true, fullName: true, username: true },
          },
          batch: {
            select: { id: true, batchNumber: true, expiryDate: true },
          },
        },
      }),
    ]);

    return {
      data: movements,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // 3. STOCK ADJUSTMENTS
  // -------------------------------------------------------------
  async createAdjustment(dto: CreateAdjustmentDto, userId: string) {
    const qty = Number(dto.quantity);
    if (qty <= 0) {
      throw new BadRequestException('Adjustment quantity must be greater than 0.');
    }

    // Execute atomic interactive transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify product
      const product = await tx.product.findFirst({
        where: { id: dto.productId, isDeleted: false },
      });
      if (!product) {
        throw new NotFoundException('Product not found or has been deleted.');
      }

      // 2. Verify warehouse
      const warehouse = await tx.warehouse.findFirst({
        where: { id: dto.warehouseId, isActive: true },
      });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found or is inactive.');
      }

      // 3. Read current warehouse stock
      const inventory = await tx.warehouseInventory.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: dto.warehouseId,
            productId: dto.productId,
          },
        },
      });

      const beforeStock = inventory ? Number(inventory.quantity) : 0;
      let newStock = beforeStock;
      let movementQty = qty;
      let movementType = 'ADJUSTMENT_INCREASE';

      if (dto.adjustmentType === AdjustmentType.DECREASE) {
        // Negative inventory is strictly disallowed
        if (beforeStock < qty) {
          throw new BadRequestException(
            `Insufficient stock in ${warehouse.name} for adjustment decrease. Available: ${beforeStock} ${product.unit}, Requested decrease: ${qty} ${product.unit}. Negative inventory is disallowed.`,
          );
        }
        newStock = beforeStock - qty;
        movementQty = -qty;
        movementType = 'ADJUSTMENT_DECREASE';
      } else {
        newStock = beforeStock + qty;
        movementQty = qty;
        movementType = 'ADJUSTMENT_INCREASE';
      }

      // 4. Upsert warehouse inventory
      await tx.warehouseInventory.upsert({
        where: {
          warehouseId_productId: {
            warehouseId: dto.warehouseId,
            productId: dto.productId,
          },
        },
        update: {
          quantity: new Prisma.Decimal(newStock),
        },
        create: {
          warehouseId: dto.warehouseId,
          productId: dto.productId,
          quantity: new Prisma.Decimal(newStock),
        },
      });

      // 5. Update cached product aggregate currentStock
      const updatedProduct = await tx.product.update({
        where: { id: dto.productId },
        data: {
          currentStock: {
            increment: new Prisma.Decimal(movementQty),
          },
        },
      });

      // Safety check on product global stock
      if (Number(updatedProduct.currentStock) < 0) {
        throw new BadRequestException('Operation would result in negative overall product stock.');
      }

      // 6. Generate adjustment number
      const adjustmentNumber = `ADJ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // 7. Create stock adjustment record
      const adjustment = await tx.stockAdjustment.create({
        data: {
          adjustmentNumber,
          warehouseId: dto.warehouseId,
          productId: dto.productId,
          adjustmentType: dto.adjustmentType,
          quantity: new Prisma.Decimal(qty),
          previousStock: new Prisma.Decimal(beforeStock),
          newStock: new Prisma.Decimal(newStock),
          reasonCategory: dto.reasonCategory,
          notes: dto.notes.trim(),
          authorizedBy: userId,
        },
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
          warehouse: { select: { id: true, name: true, code: true } },
          authorizer: { select: { id: true, fullName: true, username: true } },
        },
      });

      // 8. Create immutable stock movement record
      await tx.stockMovement.create({
        data: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
          movementType,
          quantity: new Prisma.Decimal(movementQty),
          beforeStock: new Prisma.Decimal(beforeStock),
          afterStock: new Prisma.Decimal(newStock),
          referenceType: 'ADJUSTMENT',
          referenceId: adjustment.id,
          referenceNumber: adjustment.adjustmentNumber,
          userId,
          reason: dto.notes.trim(),
        },
      });

      return adjustment;
    });
  }

  async getAdjustments(query: PaginationQueryDto) {
    const { page = 1, limit = 25, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { adjustmentNumber: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, adjustments] = await Promise.all([
      this.prisma.stockAdjustment.count({ where }),
      this.prisma.stockAdjustment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
          warehouse: { select: { id: true, name: true, code: true } },
          authorizer: { select: { id: true, fullName: true, username: true } },
        },
      }),
    ]);

    return {
      data: adjustments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------------------------------------------------
  // 4. INTER-WAREHOUSE STOCK TRANSFERS
  // -------------------------------------------------------------
  async createTransfer(dto: CreateTransferDto, userId: string) {
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException('Source and destination warehouse cannot be the same.');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Transfer must contain at least one item.');
    }

    const status = dto.status || TransferStatus.IN_TRANSIT;

    return this.prisma.$transaction(async (tx) => {
      // 1. Verify source and destination warehouses
      const [fromWh, toWh] = await Promise.all([
        tx.warehouse.findFirst({ where: { id: dto.fromWarehouseId, isActive: true } }),
        tx.warehouse.findFirst({ where: { id: dto.toWarehouseId, isActive: true } }),
      ]);

      if (!fromWh) throw new NotFoundException('Source warehouse not found or inactive.');
      if (!toWh) throw new NotFoundException('Destination warehouse not found or inactive.');

      // 2. Validate source stock for each item if moving to IN_TRANSIT or COMPLETED
      if (status === TransferStatus.IN_TRANSIT || status === TransferStatus.COMPLETED) {
        for (const item of dto.items) {
          const inv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: dto.fromWarehouseId,
                productId: item.productId,
              },
            },
          });
          const available = inv ? Number(inv.quantity) : 0;
          if (available < item.quantity) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            throw new BadRequestException(
              `Insufficient stock for "${product?.name || item.productId}" in source warehouse ${fromWh.name}. Available: ${available}, Requested transfer: ${item.quantity}.`,
            );
          }
        }
      }

      // 3. Generate transfer number
      const transferNumber = `TRF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // 4. Create Transfer Master
      const transfer = await tx.stockTransfer.create({
        data: {
          transferNumber,
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          transferDate: new Date(),
          status,
          notes: dto.notes?.trim() || null,
          createdBy: userId,
          items: {
            create: dto.items.map((i) => ({
              productId: i.productId,
              quantity: new Prisma.Decimal(i.quantity),
            })),
          },
        },
        include: {
          fromWarehouse: { select: { id: true, name: true, code: true } },
          toWarehouse: { select: { id: true, name: true, code: true } },
          creator: { select: { id: true, fullName: true, username: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true, unit: true } },
            },
          },
        },
      });

      // 5. If IN_TRANSIT, deduct source stock and log TRANSFER_OUT
      if (status === TransferStatus.IN_TRANSIT) {
        for (const item of dto.items) {
          const inv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: dto.fromWarehouseId,
                productId: item.productId,
              },
            },
          });
          const beforeStock = inv ? Number(inv.quantity) : 0;
          const afterStock = beforeStock - item.quantity;

          await tx.warehouseInventory.update({
            where: {
              warehouseId_productId: {
                warehouseId: dto.fromWarehouseId,
                productId: item.productId,
              },
            },
            data: { quantity: new Prisma.Decimal(afterStock) },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: dto.fromWarehouseId,
              movementType: 'TRANSFER_OUT',
              quantity: new Prisma.Decimal(-item.quantity),
              beforeStock: new Prisma.Decimal(beforeStock),
              afterStock: new Prisma.Decimal(afterStock),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Dispatched in transfer to ${toWh.name}`,
            },
          });
        }
      }

      // 6. If COMPLETED, deduct source stock (TRANSFER_OUT) AND increment destination stock (TRANSFER_IN)
      if (status === TransferStatus.COMPLETED) {
        for (const item of dto.items) {
          // Source decrement
          const fromInv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: dto.fromWarehouseId,
                productId: item.productId,
              },
            },
          });
          const fromBefore = fromInv ? Number(fromInv.quantity) : 0;
          const fromAfter = fromBefore - item.quantity;

          await tx.warehouseInventory.update({
            where: {
              warehouseId_productId: {
                warehouseId: dto.fromWarehouseId,
                productId: item.productId,
              },
            },
            data: { quantity: new Prisma.Decimal(fromAfter) },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: dto.fromWarehouseId,
              movementType: 'TRANSFER_OUT',
              quantity: new Prisma.Decimal(-item.quantity),
              beforeStock: new Prisma.Decimal(fromBefore),
              afterStock: new Prisma.Decimal(fromAfter),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Transferred to ${toWh.name}`,
            },
          });

          // Destination increment
          const toInv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: dto.toWarehouseId,
                productId: item.productId,
              },
            },
          });
          const toBefore = toInv ? Number(toInv.quantity) : 0;
          const toAfter = toBefore + item.quantity;

          await tx.warehouseInventory.upsert({
            where: {
              warehouseId_productId: {
                warehouseId: dto.toWarehouseId,
                productId: item.productId,
              },
            },
            update: { quantity: new Prisma.Decimal(toAfter) },
            create: {
              warehouseId: dto.toWarehouseId,
              productId: item.productId,
              quantity: new Prisma.Decimal(toAfter),
            },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: dto.toWarehouseId,
              movementType: 'TRANSFER_IN',
              quantity: new Prisma.Decimal(item.quantity),
              beforeStock: new Prisma.Decimal(toBefore),
              afterStock: new Prisma.Decimal(toAfter),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Received from ${fromWh.name}`,
            },
          });
        }
      }

      return transfer;
    });
  }

  async updateTransferStatus(transferId: string, dto: UpdateTransferStatusDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id: transferId },
        include: {
          items: true,
          fromWarehouse: true,
          toWarehouse: true,
        },
      });

      if (!transfer) {
        throw new NotFoundException('Stock transfer not found.');
      }

      const currentStatus = transfer.status;
      const targetStatus = dto.status;

      if (currentStatus === targetStatus) {
        return transfer;
      }

      if (currentStatus === TransferStatus.COMPLETED || currentStatus === TransferStatus.CANCELLED) {
        throw new BadRequestException(
          `Cannot change status of a transfer that is already ${currentStatus}.`,
        );
      }

      // Valid state transitions:
      // 1. DRAFT -> IN_TRANSIT
      if (currentStatus === TransferStatus.DRAFT && targetStatus === TransferStatus.IN_TRANSIT) {
        // Validate source stock & deduct
        for (const item of transfer.items) {
          const inv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.fromWarehouseId,
                productId: item.productId,
              },
            },
          });
          const available = inv ? Number(inv.quantity) : 0;
          const qty = Number(item.quantity);
          if (available < qty) {
            throw new BadRequestException(
              `Insufficient stock in source warehouse ${transfer.fromWarehouse.name}. Available: ${available}, Required: ${qty}.`,
            );
          }

          const afterStock = available - qty;
          await tx.warehouseInventory.update({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.fromWarehouseId,
                productId: item.productId,
              },
            },
            data: { quantity: new Prisma.Decimal(afterStock) },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: transfer.fromWarehouseId,
              movementType: 'TRANSFER_OUT',
              quantity: new Prisma.Decimal(-qty),
              beforeStock: new Prisma.Decimal(available),
              afterStock: new Prisma.Decimal(afterStock),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Dispatched in transfer to ${transfer.toWarehouse.name}`,
            },
          });
        }
      }

      // 2. IN_TRANSIT -> COMPLETED
      else if (
        currentStatus === TransferStatus.IN_TRANSIT &&
        targetStatus === TransferStatus.COMPLETED
      ) {
        // Increment destination stock & log TRANSFER_IN
        for (const item of transfer.items) {
          const qty = Number(item.quantity);
          const toInv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.toWarehouseId,
                productId: item.productId,
              },
            },
          });
          const toBefore = toInv ? Number(toInv.quantity) : 0;
          const toAfter = toBefore + qty;

          await tx.warehouseInventory.upsert({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.toWarehouseId,
                productId: item.productId,
              },
            },
            update: { quantity: new Prisma.Decimal(toAfter) },
            create: {
              warehouseId: transfer.toWarehouseId,
              productId: item.productId,
              quantity: new Prisma.Decimal(toAfter),
            },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: transfer.toWarehouseId,
              movementType: 'TRANSFER_IN',
              quantity: new Prisma.Decimal(qty),
              beforeStock: new Prisma.Decimal(toBefore),
              afterStock: new Prisma.Decimal(toAfter),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Received from ${transfer.fromWarehouse.name}`,
            },
          });
        }
      }

      // 3. IN_TRANSIT -> CANCELLED
      else if (
        currentStatus === TransferStatus.IN_TRANSIT &&
        targetStatus === TransferStatus.CANCELLED
      ) {
        // Restore stock to source warehouse
        for (const item of transfer.items) {
          const qty = Number(item.quantity);
          const fromInv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.fromWarehouseId,
                productId: item.productId,
              },
            },
          });
          const fromBefore = fromInv ? Number(fromInv.quantity) : 0;
          const fromAfter = fromBefore + qty;

          await tx.warehouseInventory.update({
            where: {
              warehouseId_productId: {
                warehouseId: transfer.fromWarehouseId,
                productId: item.productId,
              },
            },
            data: { quantity: new Prisma.Decimal(fromAfter) },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: transfer.fromWarehouseId,
              movementType: 'TRANSFER_IN',
              quantity: new Prisma.Decimal(qty),
              beforeStock: new Prisma.Decimal(fromBefore),
              afterStock: new Prisma.Decimal(fromAfter),
              referenceType: 'TRANSFER',
              referenceId: transfer.id,
              referenceNumber: transfer.transferNumber,
              userId,
              reason: `Cancelled transfer restock`,
            },
          });
        }
      }

      // 4. DRAFT -> CANCELLED (no stock change needed)
      else if (
        currentStatus === TransferStatus.DRAFT &&
        targetStatus === TransferStatus.CANCELLED
      ) {
        // No-op for inventory
      } else {
        throw new BadRequestException(
          `Invalid state transition from ${currentStatus} to ${targetStatus}.`,
        );
      }

      return tx.stockTransfer.update({
        where: { id: transferId },
        data: {
          status: targetStatus,
          notes: dto.notes ? `${transfer.notes || ''}\n[Status Change]: ${dto.notes}`.trim() : undefined,
        },
        include: {
          fromWarehouse: { select: { id: true, name: true, code: true } },
          toWarehouse: { select: { id: true, name: true, code: true } },
          creator: { select: { id: true, fullName: true, username: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true, unit: true } },
            },
          },
        },
      });
    });
  }

  async getTransfers(query: PaginationQueryDto) {
    const { page = 1, limit = 25, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { transferNumber: { contains: search, mode: 'insensitive' } },
        { fromWarehouse: { name: { contains: search, mode: 'insensitive' } } },
        { toWarehouse: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, transfers] = await Promise.all([
      this.prisma.stockTransfer.count({ where }),
      this.prisma.stockTransfer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          fromWarehouse: { select: { id: true, name: true, code: true } },
          toWarehouse: { select: { id: true, name: true, code: true } },
          creator: { select: { id: true, fullName: true, username: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true, unit: true } },
            },
          },
        },
      }),
    ]);

    return {
      data: transfers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransferById(id: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: {
        fromWarehouse: { select: { id: true, name: true, code: true, address: true } },
        toWarehouse: { select: { id: true, name: true, code: true, address: true } },
        creator: { select: { id: true, fullName: true, username: true } },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                unit: true,
                sellingPrice: true,
              },
            },
          },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundException(`Stock transfer with ID "${id}" not found.`);
    }

    return transfer;
  }
}
