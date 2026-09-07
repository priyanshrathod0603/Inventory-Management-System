import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'System Liveness Check' })
  @ApiResponse({ status: 200, description: 'System is healthy and operational' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ims-api',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'System Readiness Check' })
  @ApiResponse({ status: 200, description: 'Database and dependencies are ready' })
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'degraded',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error?.message || 'Database connection failed',
      };
    }
  }
}
