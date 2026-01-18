import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async kpis() {
    const [orders] = await this.dataSource.query(
      'SELECT COUNT(*) as totalOrders FROM orders'
    );
    const [customers] = await this.dataSource.query(
      'SELECT COUNT(*) as totalCustomers FROM customers'
    );
    const [products] = await this.dataSource.query(
      'SELECT COUNT(*) as totalProducts FROM products'
    );

    return {
      totalOrders: orders?.totalOrders ?? 0,
      totalCustomers: customers?.totalCustomers ?? 0,
      totalProducts: products?.totalProducts ?? 0
    };
  }
}
