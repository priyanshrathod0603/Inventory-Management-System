import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOnboardingDto {
  @ApiProperty({
    example: 'GROCERY',
    description:
      'Selected business type (e.g. GENERAL_STORE, GROCERY, FOOTWEAR, CLOTHING, ELECTRONICS, FURNITURE, HARDWARE, PHARMACY, RETAIL, OTHER)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  businessType: string;

  @ApiPropertyOptional({
    example: 'Custom Artisanal Bakery',
    description: 'Custom description when businessType is OTHER',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  customBusinessType?: string;

  @ApiProperty({
    example: 'Sharma Grocery & Daily Needs',
    description: 'Official trading business name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  businessName: string;

  @ApiPropertyOptional({ example: 'Rajesh Sharma', description: 'Business owner or contact person' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ownerName?: string;

  @ApiPropertyOptional({ example: '+91 9876543210', description: 'Primary phone number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: '+91 9876543210', description: 'WhatsApp business contact' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'contact@sharmagrocery.com', description: 'Official business email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://sharmagrocery.com', description: 'Business website' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: 'Shop 4, Main Market, Sector 14', description: 'Street address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Gurugram', description: 'City' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Haryana', description: 'State or Province' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'India', default: 'India', description: 'Country' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '122001', description: 'Postal or PIN Code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether business is registered for GST / Sales Tax' })
  @IsBoolean()
  @IsOptional()
  isGstRegistered?: boolean;

  @ApiPropertyOptional({ example: '07AAAAA0000A1Z5', description: 'GSTIN identification number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  gstin?: string;

  @ApiPropertyOptional({ example: 'INR', default: 'INR', description: 'Base operating currency' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: '₹', default: '₹', description: 'Currency symbol' })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  currencySymbol?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether multi-warehouse inventory management is enabled for this business',
  })
  @IsBoolean()
  @IsOptional()
  isMultiWarehouse?: boolean;

  @ApiPropertyOptional({ example: 4, description: 'Final onboarding step completed' })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  onboardingStep?: number;
}
