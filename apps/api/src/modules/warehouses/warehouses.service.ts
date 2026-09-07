import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateWarehouseDto) {
    const existingName = await this.prisma.warehouse.findUnique({
      where: { name: createDto.name.trim() },
    });
    if (existingName) {
      throw new ConflictException(`Warehouse with name "${createDto.name}" already exists.`);
    }

    const existingCode = await this.prisma.warehouse.findUnique({
      where: { code: createDto.code.trim().toUpperCase() },
    });
    if (existingCode) {
      throw new ConflictException(`Warehouse with code "${createDto.code}" already exists.`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (createDto.isDefault) {
        await tx.warehouse.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.warehouse.create({
        data: {
          name: createDto.name.trim(),
          code: createDto.code.trim().toUpperCase(),
          address: createDto.address?.trim() || null,
          isDefault: createDto.isDefault || false,
        },
        include: {
          _count: { select: { warehouseInventory: true } },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      include: {
        _count: { select: { warehouseInventory: true } },
      },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        _count: { select: { warehouseInventory: true } },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID "${id}" not found.`);
    }

    return warehouse;
  }

  async update(id: string, updateDto: UpdateWarehouseDto) {
    await this.findOne(id);

    if (updateDto.name) {
      const existingName = await this.prisma.warehouse.findFirst({
        where: { name: updateDto.name.trim(), id: { not: id } },
      });
      if (existingName) {
        throw new ConflictException(`Warehouse with name "${updateDto.name}" already exists.`);
      }
    }

    if (updateDto.code) {
      const existingCode = await this.prisma.warehouse.findFirst({
        where: { code: updateDto.code.trim().toUpperCase(), id: { not: id } },
      });
      if (existingCode) {
        throw new ConflictException(`Warehouse with code "${updateDto.code}" already exists.`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (updateDto.isDefault) {
        await tx.warehouse.updateMany({
          where: { isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.warehouse.update({
        where: { id },
        data: {
          name: updateDto.name ? updateDto.name.trim() : undefined,
          code: updateDto.code ? updateDto.code.trim().toUpperCase() : undefined,
          address: updateDto.address !== undefined ? updateDto.address?.trim() || null : undefined,
          isDefault: updateDto.isDefault !== undefined ? updateDto.isDefault : undefined,
          isActive: updateDto.isActive !== undefined ? updateDto.isActive : undefined,
        },
        include: {
          _count: { select: { warehouseInventory: true } },
        },
      });
    });
  }
}
