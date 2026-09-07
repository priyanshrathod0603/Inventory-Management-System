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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Products')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions('create_product')
  @ApiOperation({ summary: 'Create a new catalog product with initial opening stock' })
  create(@Body() createDto: CreateProductDto, @CurrentUser('id') userId: string) {
    return this.productsService.create(createDto, userId);
  }

  @Get()
  @Permissions('view_products')
  @ApiOperation({ summary: 'List products with filters, search, and stock status' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('barcode/:barcode')
  @Permissions('view_products')
  @ApiOperation({ summary: 'Fast POS barcode lookup' })
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  @Get(':id')
  @Permissions('view_products')
  @ApiOperation({ summary: 'Get full product details by UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('edit_product')
  @ApiOperation({ summary: 'Update product information' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('delete_product')
  @ApiOperation({ summary: 'Soft-delete a product' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
