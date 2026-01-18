import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../db/entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('sortBy') sortBy = 'orderDate',
    @Query('sortDir') sortDir = 'DESC',
    @Query('search') search?: string
  ) {
    return this.ordersService.findAllPaged({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy,
      sortDir: sortDir === 'ASC' ? 'ASC' : 'DESC',
      search
    });
  }

  @Get(':orderNumber')
  findOne(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findOne(Number(orderNumber));
  }

  @Post()
  create(@Body() payload: Partial<Order>) {
    return this.ordersService.create(payload);
  }

  @Patch(':orderNumber')
  update(
    @Param('orderNumber') orderNumber: string,
    @Body() payload: Partial<Order>
  ) {
    return this.ordersService.update(Number(orderNumber), payload);
  }

  @Delete(':orderNumber')
  remove(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.remove(Number(orderNumber));
  }
}
