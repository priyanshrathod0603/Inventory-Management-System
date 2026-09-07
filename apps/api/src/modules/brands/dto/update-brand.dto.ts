import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiPropertyOptional({ description: 'Brand active state', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
