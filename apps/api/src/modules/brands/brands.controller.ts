import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQueryDto } from './dto/brand-query.dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Brands')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Permissions('create_product')
  @ApiOperation({ summary: 'Create a new brand' })
  create(@Body() createDto: CreateBrandDto) {
    return this.brandsService.create(createDto);
  }

  @Get()
  @Permissions('view_products')
  @ApiOperation({ summary: 'List brands with search and pagination' })
  findAll(@Query() query: BrandQueryDto) {
    return this.brandsService.findAll(query);
  }

  @Get(':id')
  @Permissions('view_products')
  @ApiOperation({ summary: 'Get brand by UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('edit_product')
  @ApiOperation({ summary: 'Update an existing brand' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('delete_product')
  @ApiOperation({ summary: 'Soft-delete a brand' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id);
  }
}
