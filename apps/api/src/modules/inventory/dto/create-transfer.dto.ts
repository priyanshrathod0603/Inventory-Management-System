import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TransferStatus {
  DRAFT = 'DRAFT',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class TransferItemDto {
  @ApiProperty({ description: 'Product UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid product ID is required' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @ApiProperty({ description: 'Quantity to transfer', example: 10.0 })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'Quantity must be a valid numeric quantity' })
  @Min(0.001, { message: 'Transfer quantity must be greater than 0' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @Type(() => Number)
  quantity: number;
}

export class CreateTransferDto {
  @ApiProperty({ description: 'Source warehouse UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid source warehouse ID is required' })
  @IsNotEmpty({ message: 'Source warehouse is required' })
  fromWarehouseId: string;

  @ApiProperty({ description: 'Destination warehouse UUID', example: 'uuid' })
  @IsUUID('4', { message: 'Valid destination warehouse ID is required' })
  @IsNotEmpty({ message: 'Destination warehouse is required' })
  toWarehouseId: string;

  @ApiProperty({
    description: 'Initial transfer status (defaults to DRAFT or IN_TRANSIT)',
    enum: [TransferStatus.DRAFT, TransferStatus.IN_TRANSIT, TransferStatus.COMPLETED],
    default: TransferStatus.IN_TRANSIT,
  })
  @IsEnum(TransferStatus, { message: 'Status must be DRAFT, IN_TRANSIT, or COMPLETED' })
  @IsOptional()
  status?: TransferStatus;

  @ApiPropertyOptional({ description: 'Transfer notes or vehicle/dispatch reference', example: 'Dispatch via Van #4' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Transfer line items', type: [TransferItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Transfer must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[];
}
