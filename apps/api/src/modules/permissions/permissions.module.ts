import { Module } from '@nestjs/common';
import { PermissionsSeederService } from './permissions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PermissionsSeederService],
  exports: [PermissionsSeederService],
})
export class PermissionsModule {}
