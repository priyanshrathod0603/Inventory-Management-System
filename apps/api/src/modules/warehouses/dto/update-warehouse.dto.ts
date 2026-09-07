import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiPropertyOptional({ description: 'Warehouse active state', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
