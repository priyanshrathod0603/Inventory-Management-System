import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Warehouse name', example: 'Main Storefront' })
  @IsString()
  @IsNotEmpty({ message: 'Warehouse name is required' })
  @MaxLength(100, { message: 'Warehouse name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({ description: 'Warehouse code', example: 'WH-MAIN' })
  @IsString()
  @IsNotEmpty({ message: 'Warehouse code is required' })
  @MaxLength(20, { message: 'Warehouse code cannot exceed 20 characters' })
  code: string;

  @ApiPropertyOptional({ description: 'Physical address / location details', example: 'Plot 42, Industrial Area, Sector 5' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Mark as default receiving warehouse', example: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
