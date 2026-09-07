import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Beverages' })
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MaxLength(100, { message: 'Category name cannot exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug (auto-generated if omitted)', example: 'beverages' })
  @IsString()
  @IsOptional()
  @MaxLength(120, { message: 'Slug cannot exceed 120 characters' })
  slug?: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Cold drinks, juices, and tea' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Parent category UUID for subcategories', example: 'uuid' })
  @IsUUID('4', { message: 'Invalid parent category ID' })
  @IsOptional()
  parentId?: string;
}
