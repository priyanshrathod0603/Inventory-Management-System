import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQueryDto } from './dto/brand-query.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateBrandDto) {
    const existingName = await this.prisma.brand.findFirst({
      where: {
        name: { equals: createDto.name, mode: 'insensitive' },
        isDeleted: false,
      },
    });
    if (existingName) {
      throw new ConflictException(`Brand with name "${createDto.name}" already exists.`);
    }

    return this.prisma.brand.create({
      data: {
        name: createDto.name.trim(),
        description: createDto.description?.trim() || null,
      },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findAll(query: BrandQueryDto) {
    const { page = 1, limit = 25, search, sortBy = 'name', sortOrder = 'asc', isActive } = query;

    const where: any = { isDeleted: false };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, brands] = await Promise.all([
      this.prisma.brand.count({ where }),
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { products: true } },
        },
      }),
    ]);

    return {
      data: brands,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { id, isDeleted: false },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID "${id}" not found.`);
    }

    return brand;
  }

  async update(id: string, updateDto: UpdateBrandDto) {
    await this.findOne(id);

    if (updateDto.name) {
      const existingName = await this.prisma.brand.findFirst({
        where: {
          name: { equals: updateDto.name, mode: 'insensitive' },
          id: { not: id },
          isDeleted: false,
        },
      });
      if (existingName) {
        throw new ConflictException(`Brand with name "${updateDto.name}" already exists.`);
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        name: updateDto.name ? updateDto.name.trim() : undefined,
        description: updateDto.description !== undefined ? updateDto.description?.trim() || null : undefined,
        isActive: updateDto.isActive !== undefined ? updateDto.isActive : undefined,
      },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }
}
