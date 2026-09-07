import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferStatusDto } from './dto/update-transfer-status.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { InventoryOverviewQueryDto } from './dto/inventory-overview-query.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Inventory')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('overview')
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'Get inventory stock overview, KPIs, and valuation' })
  getOverview(@Query() query: InventoryOverviewQueryDto) {
    return this.inventoryService.getOverview(query);
  }

  @Get('movements')
  @Permissions('view_stock_movements')
  @ApiOperation({ summary: 'Query immutable historical stock movement ledger' })
  getMovements(@Query() query: StockMovementQueryDto) {
    return this.inventoryService.getMovements(query);
  }

  @Post('adjustments')
  @Permissions('adjust_stock')
  @ApiOperation({ summary: 'Execute an atomic stock adjustment with mandatory reason' })
  createAdjustment(
    @Body() dto: CreateAdjustmentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inventoryService.createAdjustment(dto, userId);
  }

  @Get('adjustments')
  @Permissions('view_stock_movements')
  @ApiOperation({ summary: 'List stock adjustments history' })
  getAdjustments(@Query() query: PaginationQueryDto) {
    return this.inventoryService.getAdjustments(query);
  }

  @Post('transfers')
  @Permissions('transfer_stock')
  @ApiOperation({ summary: 'Create an inter-warehouse stock transfer' })
  createTransfer(
    @Body() dto: CreateTransferDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inventoryService.createTransfer(dto, userId);
  }

  @Get('transfers')
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'List inter-warehouse stock transfers' })
  getTransfers(@Query() query: PaginationQueryDto) {
    return this.inventoryService.getTransfers(query);
  }

  @Get('transfers/:id')
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'Get transfer details by UUID' })
  getTransferById(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.getTransferById(id);
  }

  @Patch('transfers/:id/status')
  @Permissions('transfer_stock')
  @ApiOperation({ summary: 'Update transfer status (DRAFT -> IN_TRANSIT -> COMPLETED / CANCELLED)' })
  updateTransferStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransferStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inventoryService.updateTransferStatus(id, dto, userId);
  }
}
