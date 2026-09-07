import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchQueryDto } from './dto/batch-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  private computeBatchStatus(
    quantity: number,
    expiryDate: Date,
  ): { status: string; daysRemaining: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);

    const diffTime = exp.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = 'ACTIVE';
    if (quantity <= 0) {
      status = 'DEPLETED';
    } else if (daysRemaining < 0) {
      status = 'EXPIRED';
    } else if (daysRemaining <= 30) {
      status = 'NEAR_EXPIRY';
    }

    return { status, daysRemaining };
  }

  async create(createDto: CreateBatchDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: createDto.productId, isDeleted: false },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: createDto.warehouseId, isActive: true },
    });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found or is inactive.');
    }

    const expiryDate = new Date(createDto.expiryDate);
    const mfgDate = createDto.mfgDate ? new Date(createDto.mfgDate) : null;

    if (mfgDate && mfgDate > expiryDate) {
      throw new BadRequestException('Manufacturing date cannot be after expiry date.');
    }

    const { status, daysRemaining } = this.computeBatchStatus(
      Number(createDto.quantity),
      expiryDate,
    );

    const batch = await this.prisma.productBatch.create({
      data: {
        productId: createDto.productId,
        warehouseId: createDto.warehouseId,
        batchNumber: createDto.batchNumber.trim().toUpperCase(),
        mfgDate,
        expiryDate,
        quantity: new Prisma.Decimal(createDto.quantity),
        purchasePrice: new Prisma.Decimal(createDto.purchasePrice),
        status,
      },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true } },
        warehouse: { select: { id: true, name: true, code: true } },
      },
    });

    // If product doesn't have batch tracking enabled, enable it
    if (!product.hasBatchTracking) {
      await this.prisma.product.update({
        where: { id: product.id },
        data: { hasBatchTracking: true },
      });
    }

    return {
      ...batch,
      daysRemaining,
    };
  }

  async findAll(query: BatchQueryDto) {
    const {
      page = 1,
      limit = 25,
      search,
      sortBy = 'expiryDate',
      sortOrder = 'asc',
      productId,
      warehouseId,
      status,
    } = query;

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (search) {
      where.OR = [
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, batches] = await Promise.all([
      this.prisma.productBatch.count({ where }),
      this.prisma.productBatch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
          warehouse: { select: { id: true, name: true, code: true } },
        },
      }),
    ]);

    const formatted = batches.map((b) => {
      const computed = this.computeBatchStatus(Number(b.quantity), b.expiryDate);
      return {
        ...b,
        status: computed.status,
        daysRemaining: computed.daysRemaining,
      };
    });

    let filtered = formatted;
    if (status) {
      filtered = formatted.filter((b) => b.status === status.toUpperCase());
    }

    return {
      data: filtered,
      meta: {
        page,
        limit,
        total: status ? filtered.length : total,
        totalPages: Math.ceil((status ? filtered.length : total) / limit),
      },
    };
  }

  async findByProduct(productId: string) {
    const batches = await this.prisma.productBatch.findMany({
      where: {
        productId,
        quantity: { gt: 0 },
      },
      orderBy: { expiryDate: 'asc' },
      include: {
        warehouse: { select: { id: true, name: true, code: true } },
      },
    });

    return batches.map((b) => {
      const computed = this.computeBatchStatus(Number(b.quantity), b.expiryDate);
      return {
        ...b,
        status: computed.status,
        daysRemaining: computed.daysRemaining,
      };
    });
  }
}
