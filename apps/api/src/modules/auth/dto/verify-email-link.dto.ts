import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailLinkDto {
  @ApiProperty({ description: 'Cryptographic verification link token' })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}
