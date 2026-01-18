import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../db/entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('sortBy') sortBy = 'customerName',
    @Query('sortDir') sortDir = 'ASC',
    @Query('search') search?: string
  ) {
    return this.customersService.findAllPaged({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy,
      sortDir: sortDir === 'DESC' ? 'DESC' : 'ASC',
      search
    });
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
