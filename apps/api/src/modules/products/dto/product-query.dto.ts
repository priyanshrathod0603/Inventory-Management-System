import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export enum StockStatusFilter {
  ALL = 'ALL',
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by Category UUID' })
  @IsUUID('4', { message: 'Invalid category ID' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by Brand UUID' })
  @IsUUID('4', { message: 'Invalid brand ID' })
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Filter by Warehouse UUID (for warehouse-specific stock filtering)' })
  @IsUUID('4', { message: 'Invalid warehouse ID' })
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'Filter by stock status',
    enum: StockStatusFilter,
    example: StockStatusFilter.IN_STOCK,
  })
  @IsEnum(StockStatusFilter)
  @IsOptional()
  stockStatus?: StockStatusFilter;

  @ApiPropertyOptional({ description: 'Filter by active state' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isActive?: boolean;
}
