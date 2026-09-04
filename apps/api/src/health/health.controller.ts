import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'System Health Check' })
  @ApiResponse({ status: 200, description: 'System is healthy and operational' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sms-api',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
