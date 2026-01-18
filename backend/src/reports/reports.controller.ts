import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('customers-summary')
  listOrdersSummaryByCustomer() {
    return this.reportsService.listOrdersSummaryByCustomer();
  }

  @Get('warehouse-status')
  listWarehouseStatus() {
    return this.reportsService.listWarehouseStatus();
  }

  @Get('sales-by-employee')
  listSalesByEmployee() {
    return this.reportsService.listSalesByEmployee();
  }

  @Get('top-customers/:limit')
  topCustomers(@Param('limit') limit: string) {
    return this.reportsService.topCustomers(Number(limit));
  }

  @Get('monthly-sales')
  monthlySalesReport(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('startEmployee') startEmployee: string,
    @Query('endEmployee') endEmployee: string
  ) {
    return this.reportsService.monthlySalesReport(
      Number(year),
      Number(month),
      Number(startEmployee),
      Number(endEmployee)
    );
  }
}
