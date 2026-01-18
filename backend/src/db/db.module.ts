import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Employee } from './entities/employee.entity';
import { Office } from './entities/office.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Payment } from './entities/payment.entity';
import { Product } from './entities/product.entity';
import { ProductLine } from './entities/product-line.entity';

const entities = [
  Customer,
  Employee,
  Office,
  Order,
  OrderDetail,
  Payment,
  Product,
  ProductLine
];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule]
})
export class DbModule {}
