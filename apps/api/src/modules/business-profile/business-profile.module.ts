import { Module } from '@nestjs/common';
import { BusinessProfileController } from './business-profile.controller';
import { BusinessProfileService } from './business-profile.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
  exports: [BusinessProfileService],
})
export class BusinessProfileModule {}
