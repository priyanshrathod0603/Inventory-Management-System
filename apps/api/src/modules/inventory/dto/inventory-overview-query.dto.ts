import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { StockStatusFilter } from '../../products/dto/product-query.dto';

export class InventoryOverviewQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter inventory by Warehouse UUID' })
  @IsUUID('4', { message: 'Invalid warehouse ID' })
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({ description: 'Filter by Category UUID' })
  @IsUUID('4', { message: 'Invalid category ID' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by stock status',
    enum: StockStatusFilter,
  })
  @IsEnum(StockStatusFilter)
  @IsOptional()
  stockStatus?: StockStatusFilter;
}
