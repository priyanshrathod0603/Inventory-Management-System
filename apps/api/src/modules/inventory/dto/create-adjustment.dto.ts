import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export enum AdjustmentReasonCategory {
  DAMAGED_GOODS = 'DAMAGED_GOODS',
  EXPIRED_BATCH = 'EXPIRED_BATCH',
  PHYSICAL_COUNT_DISCREPANCY = 'PHYSICAL_COUNT_DISCREPANCY',
  INTERNAL_STORE_CONSUMPTION = 'INTERNAL_STORE_CONSUMPTION',
  THEFT_SHRINKAGE = 'THEFT_SHRINKAGE',
  OTHER = 'OTHER',
}

export class CreateAdjustmentDto {
  @ApiProperty({ description: 'Product UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid product ID is required' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @ApiProperty({ description: 'Warehouse UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid warehouse ID is required' })
  @IsNotEmpty({ message: 'Warehouse ID is required' })
  warehouseId: string;

  @ApiProperty({
    description: 'Adjustment direction type',
    enum: AdjustmentType,
    example: AdjustmentType.DECREASE,
  })
  @IsEnum(AdjustmentType, { message: 'Adjustment type must be INCREASE or DECREASE' })
  @IsNotEmpty({ message: 'Adjustment type is required' })
  adjustmentType: AdjustmentType;

  @ApiProperty({ description: 'Quantity to adjust (positive decimal)', example: 5.0 })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'Quantity must be a valid numeric quantity' })
  @Min(0.001, { message: 'Adjustment quantity must be greater than 0' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Mandatory business reason category',
    enum: AdjustmentReasonCategory,
    example: AdjustmentReasonCategory.DAMAGED_GOODS,
  })
  @IsEnum(AdjustmentReasonCategory, { message: 'Valid reason category is required' })
  @IsNotEmpty({ message: 'Reason category is required' })
  reasonCategory: AdjustmentReasonCategory;

  @ApiProperty({ description: 'Operator notes or discrepancy explanation', example: 'Water damage on shelf B-4' })
  @IsString()
  @IsNotEmpty({ message: 'Audit note/explanation is mandatory for stock adjustment' })
  notes: string;
}
