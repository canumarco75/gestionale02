import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../db/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('sortBy') sortBy = 'productName',
    @Query('sortDir') sortDir = 'ASC',
    @Query('search') search?: string
  ) {
    return this.productsService.findAllPaged({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy,
      sortDir: sortDir === 'DESC' ? 'DESC' : 'ASC',
      search
    });
  }

  @Get(':productCode')
  findOne(@Param('productCode') productCode: string) {
    return this.productsService.findOne(productCode);
  }

  @Post()
  create(@Body() payload: Partial<Product>) {
    return this.productsService.create(payload);
  }

  @Patch(':productCode')
  update(
    @Param('productCode') productCode: string,
    @Body() payload: Partial<Product>
  ) {
    return this.productsService.update(productCode, payload);
  }

  @Delete(':productCode')
  remove(@Param('productCode') productCode: string) {
    return this.productsService.remove(productCode);
  }
}
