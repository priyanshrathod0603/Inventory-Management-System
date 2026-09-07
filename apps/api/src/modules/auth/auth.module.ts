import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { EmailVerificationService } from './services/email-verification.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { MailService } from './services/mail.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, PermissionsModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SessionService,
    EmailVerificationService,
    GoogleOAuthService,
    MailService,
  ],
  exports: [AuthService, SessionService, PasswordService, MailService, GoogleOAuthService],
})
export class AuthModule {}
