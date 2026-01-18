import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'orderdetails' })
export class OrderDetail {
  @PrimaryColumn({ type: 'int', name: 'orderNumber' })
  orderNumber: number;

  @PrimaryColumn({ type: 'varchar', length: 15, name: 'productCode' })
  productCode: string;

  @Column({ type: 'int', name: 'quantityOrdered' })
  quantityOrdered: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'priceEach' })
  priceEach: string;

  @Column({ type: 'smallint', name: 'orderLineNumber' })
  orderLineNumber: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'orderNumber' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'productCode' })
  product: Product;
}
