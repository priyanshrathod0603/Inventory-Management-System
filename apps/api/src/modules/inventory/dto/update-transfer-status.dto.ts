import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransferStatus } from './create-transfer.dto';

export class UpdateTransferStatusDto {
  @ApiProperty({
    description: 'Target transfer status',
    enum: TransferStatus,
    example: TransferStatus.COMPLETED,
  })
  @IsEnum(TransferStatus, { message: 'Invalid transfer status' })
  @IsNotEmpty({ message: 'Status is required' })
  status: TransferStatus;

  @ApiPropertyOptional({ description: 'Status update reason / notes', example: 'Shipment received at Central Godown' })
  @IsString()
  @IsOptional()
  notes?: string;
}
