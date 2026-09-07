import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchDto {
  @ApiProperty({ description: 'Product UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid product ID is required' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @ApiProperty({ description: 'Warehouse UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid warehouse ID is required' })
  @IsNotEmpty({ message: 'Warehouse ID is required' })
  warehouseId: string;

  @ApiProperty({ description: 'Batch number / Lot identifier', example: 'BATCH-2026-09A' })
  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  @MaxLength(100, { message: 'Batch number cannot exceed 100 characters' })
  batchNumber: string;

  @ApiPropertyOptional({ description: 'Manufacturing date (ISO string)', example: '2026-03-01' })
  @IsDateString({}, { message: 'Mfg date must be a valid date' })
  @IsOptional()
  mfgDate?: string;

  @ApiProperty({ description: 'Expiry date (ISO string)', example: '2027-09-01' })
  @IsDateString({}, { message: 'Expiry date must be a valid date' })
  @IsNotEmpty({ message: 'Expiry date is required' })
  expiryDate: string;

  @ApiProperty({ description: 'Batch quantity', example: 100.0 })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'Quantity must be a valid number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'Purchase price / cost per unit for this batch (₹)', example: 130.0 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Purchase price must be a valid amount' })
  @Min(0, { message: 'Purchase price cannot be negative' })
  @IsNotEmpty({ message: 'Purchase price is required' })
  @Type(() => Number)
  purchasePrice: number;
}
