import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchQueryDto } from './dto/batch-query.dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Batches & Expiry')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @Permissions('create_product')
  @ApiOperation({ summary: 'Create a product batch with manufacturing and expiry date' })
  create(@Body() createDto: CreateBatchDto) {
    return this.batchesService.create(createDto);
  }

  @Get()
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'List batches with calculated expiry statuses and days remaining' })
  findAll(@Query() query: BatchQueryDto) {
    return this.batchesService.findAll(query);
  }

  @Get('product/:productId')
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'List active batches for a specific product' })
  findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.batchesService.findByProduct(productId);
  }
}
