import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../db/entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
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
