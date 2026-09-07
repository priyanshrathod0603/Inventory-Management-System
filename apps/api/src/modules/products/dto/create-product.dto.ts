import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title / name', example: 'Fortune Sunlite Oil 1L' })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name: string;

  @ApiProperty({ description: 'Stock Keeping Unit (Unique)', example: 'SKU-2091' })
  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @MaxLength(100, { message: 'SKU cannot exceed 100 characters' })
  sku: string;

  @ApiPropertyOptional({ description: 'Barcode / EAN / UPC (Unique)', example: '890123456789' })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Barcode cannot exceed 100 characters' })
  barcode?: string;

  @ApiProperty({ description: 'Category UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid category ID is required' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @ApiPropertyOptional({ description: 'Brand UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Invalid brand ID' })
  @IsOptional()
  brandId?: string;

  @ApiProperty({ description: 'Unit of measurement (e.g., Pcs, Kg, Litre, Box)', example: 'Bottles' })
  @IsString()
  @IsNotEmpty({ message: 'Unit is required' })
  @MaxLength(20, { message: 'Unit cannot exceed 20 characters' })
  unit: string;

  @ApiPropertyOptional({ description: 'Cost / Purchase price (₹)', example: 130.00, default: 0.00 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Purchase price must be a valid currency amount' })
  @Min(0, { message: 'Purchase price cannot be negative' })
  @IsOptional()
  @Type(() => Number)
  purchasePrice?: number;

  @ApiProperty({ description: 'Selling price (₹)', example: 165.00 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Selling price must be a valid currency amount' })
  @Min(0, { message: 'Selling price cannot be negative' })
  @IsNotEmpty({ message: 'Selling price is required' })
  @Type(() => Number)
  sellingPrice: number;

  @ApiPropertyOptional({ description: 'Maximum Retail Price MRP (₹)', example: 180.00 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'MRP must be a valid currency amount' })
  @Min(0, { message: 'MRP cannot be negative' })
  @IsOptional()
  @Type(() => Number)
  mrp?: number;

  @ApiPropertyOptional({ description: 'GST Tax Rate % (e.g. 0, 5, 12, 18, 28)', example: 5.00, default: 0.00 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Tax rate must be a valid percentage' })
  @Min(0, { message: 'Tax rate cannot be negative' })
  @IsOptional()
  @Type(() => Number)
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Whether selling price is tax-inclusive', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isTaxInclusive?: boolean;

  @ApiPropertyOptional({ description: 'Low-stock threshold for alert notifications', example: 5.000, default: 5.000 })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'Minimum stock alert must be a valid quantity' })
  @Min(0, { message: 'Minimum stock alert cannot be negative' })
  @IsOptional()
  @Type(() => Number)
  minStockAlert?: number;

  @ApiPropertyOptional({ description: 'Initial opening stock quantity', example: 50.000, default: 0.000 })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'Initial opening stock must be a valid quantity' })
  @Min(0, { message: 'Initial opening stock cannot be negative' })
  @IsOptional()
  @Type(() => Number)
  initialOpeningStock?: number;

  @ApiPropertyOptional({ description: 'Warehouse UUID to assign opening stock to', example: 'uuid' })
  @IsUUID('4', { message: 'Invalid warehouse ID' })
  @IsOptional()
  warehouseId?: string;

  @ApiPropertyOptional({ description: 'Enable batch & expiry date tracking', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  hasBatchTracking?: boolean;
}
