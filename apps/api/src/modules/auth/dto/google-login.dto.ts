import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({ description: 'Google OAuth ID Token received from Google Sign-In' })
  @IsString()
  @IsNotEmpty({ message: 'Google ID token is required' })
  idToken: string;
}
