import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../db/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
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
