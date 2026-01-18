import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../db/entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':customerNumber')
  findOne(@Param('customerNumber') customerNumber: string) {
    return this.customersService.findOne(Number(customerNumber));
  }

  @Post()
  create(@Body() payload: Partial<Customer>) {
    return this.customersService.create(payload);
  }

  @Patch(':customerNumber')
  update(
    @Param('customerNumber') customerNumber: string,
    @Body() payload: Partial<Customer>
  ) {
    return this.customersService.update(Number(customerNumber), payload);
  }

  @Delete(':customerNumber')
  remove(@Param('customerNumber') customerNumber: string) {
    return this.customersService.remove(Number(customerNumber));
  }
}
