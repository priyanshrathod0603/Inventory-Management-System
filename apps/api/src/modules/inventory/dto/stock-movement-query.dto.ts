import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class StockMovementQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by Product UUID' })
  @IsUUID('4', { message: 'Invalid product ID' })
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by Warehouse UUID' })
  @IsUUID('4', { message: 'Invalid warehouse ID' })
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'Filter by movement type',
    example: 'ADJUSTMENT_DECREASE',
  })
  @IsString()
  @IsOptional()
  movementType?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO format)', example: '2026-09-01T00:00:00.000Z' })
  @IsDateString({}, { message: 'Start date must be an ISO date string' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO format)', example: '2026-09-30T23:59:59.999Z' })
  @IsDateString({}, { message: 'End date must be an ISO date string' })
  @IsOptional()
  endDate?: string;
}
