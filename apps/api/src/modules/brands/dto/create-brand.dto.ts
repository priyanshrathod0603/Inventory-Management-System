import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: 'Brand name', example: 'Nestle' })
  @IsString()
  @IsNotEmpty({ message: 'Brand name is required' })
  @MaxLength(100, { message: 'Brand name cannot exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ description: 'Brand description', example: 'Packaged foods and dairy products' })
  @IsString()
  @IsOptional()
  description?: string;
}
