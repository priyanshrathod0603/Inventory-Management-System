import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SaveOnboardingDraftDto {
  @ApiPropertyOptional({ example: 'GROCERY' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessType?: string;

  @ApiPropertyOptional({ example: 'Custom Store' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  customBusinessType?: string;

  @ApiPropertyOptional({ example: 'Sharma Grocery' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  businessName?: string;

  @ApiPropertyOptional({ example: 'Rajesh Sharma' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ownerName?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'contact@sharmagrocery.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://sharmagrocery.com' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: 'Shop 4, Main Market' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Gurugram' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Haryana' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '122001' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isGstRegistered?: boolean;

  @ApiPropertyOptional({ example: '07AAAAA0000A1Z5' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  gstin?: string;

  @ApiPropertyOptional({ example: 'INR' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: '₹' })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  currencySymbol?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isMultiWarehouse?: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  onboardingStep?: number;
}
