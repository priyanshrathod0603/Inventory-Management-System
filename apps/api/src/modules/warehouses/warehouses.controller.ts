import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Warehouses')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @Permissions('manage_settings')
  @ApiOperation({ summary: 'Create a new warehouse location' })
  create(@Body() createDto: CreateWarehouseDto) {
    return this.warehousesService.create(createDto);
  }

  @Get()
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'List all warehouses' })
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  @Permissions('view_inventory')
  @ApiOperation({ summary: 'Get warehouse by UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('manage_settings')
  @ApiOperation({ summary: 'Update warehouse details or default flag' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateDto);
  }
}
