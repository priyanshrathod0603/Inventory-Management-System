import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class BatchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by Product UUID' })
  @IsUUID('4', { message: 'Invalid product ID' })
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by Warehouse UUID' })
  @IsUUID('4', { message: 'Invalid warehouse ID' })
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'Filter by batch status (ACTIVE, NEAR_EXPIRY, EXPIRED, DEPLETED)',
    example: 'NEAR_EXPIRY',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
