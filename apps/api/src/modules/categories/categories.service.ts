import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createDto: CreateCategoryDto) {
    const slug = createDto.slug
      ? this.slugify(createDto.slug)
      : this.slugify(createDto.name);

    // Check name uniqueness
    const existingName = await this.prisma.category.findFirst({
      where: {
        name: { equals: createDto.name, mode: 'insensitive' },
        isDeleted: false,
      },
    });
    if (existingName) {
      throw new ConflictException(`Category with name "${createDto.name}" already exists.`);
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingSlug && !existingSlug.isDeleted) {
      throw new ConflictException(`Category with slug "${slug}" already exists.`);
    }

    // Validate parent if provided
    if (createDto.parentId) {
      const parent = await this.prisma.category.findFirst({
        where: { id: createDto.parentId, isDeleted: false },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
    }

    return this.prisma.category.create({
      data: {
        name: createDto.name.trim(),
        slug,
        description: createDto.description?.trim() || null,
        parentId: createDto.parentId || null,
      },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true, children: true } },
      },
    });
  }

  async findAll(query: CategoryQueryDto) {
    const { page = 1, limit = 25, search, sortBy = 'createdAt', sortOrder = 'desc', isActive, tree } = query;

    const where: any = { isDeleted: false };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tree) {
      // Tree mode: return top-level categories with recursive children
      const rootCategories = await this.prisma.category.findMany({
        where: { ...where, parentId: null },
        orderBy: { name: 'asc' },
        include: {
          children: {
            where: { isDeleted: false },
            include: {
              children: { where: { isDeleted: false } },
              _count: { select: { products: true } },
            },
          },
          _count: { select: { products: true } },
        },
      });

      return {
        data: rootCategories,
        meta: {
          page: 1,
          limit: rootCategories.length,
          total: rootCategories.length,
          totalPages: 1,
        },
      };
    }

    const skip = (page - 1) * limit;

    const [total, categories] = await Promise.all([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          parent: { select: { id: true, name: true, slug: true } },
          _count: { select: { products: true, children: true } },
        },
      }),
    ]);

    return {
      data: categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          where: { isDeleted: false },
          select: { id: true, name: true, slug: true, isActive: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }

    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateDto.parentId && updateDto.parentId === id) {
      throw new BadRequestException('A category cannot be its own parent.');
    }

    if (updateDto.name && updateDto.name !== category.name) {
      const existingName = await this.prisma.category.findFirst({
        where: {
          name: { equals: updateDto.name, mode: 'insensitive' },
          id: { not: id },
          isDeleted: false,
        },
      });
      if (existingName) {
        throw new ConflictException(`Category with name "${updateDto.name}" already exists.`);
      }
    }

    let slug = category.slug;
    if (updateDto.slug) {
      slug = this.slugify(updateDto.slug);
      const existingSlug = await this.prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingSlug && !existingSlug.isDeleted) {
        throw new ConflictException(`Category with slug "${slug}" already exists.`);
      }
    } else if (updateDto.name && updateDto.name !== category.name && !updateDto.slug) {
      slug = this.slugify(updateDto.name);
    }

    if (updateDto.parentId) {
      const parent = await this.prisma.category.findFirst({
        where: { id: updateDto.parentId, isDeleted: false },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateDto.name ? updateDto.name.trim() : undefined,
        slug,
        description: updateDto.description !== undefined ? updateDto.description?.trim() || null : undefined,
        parentId: updateDto.parentId !== undefined ? updateDto.parentId : undefined,
        isActive: updateDto.isActive !== undefined ? updateDto.isActive : undefined,
      },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true, children: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete category and detach parent references from subcategories
    return this.prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }
}
