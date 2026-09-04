import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username or Email address', example: 'rahul_cashier' })
  @IsString()
  @IsNotEmpty({ message: 'Identifier (username or email) is required' })
  identifier: string;

  @ApiProperty({ description: 'Plaintext password', example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiPropertyOptional({ description: 'Extend session duration to 30 days', default: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
