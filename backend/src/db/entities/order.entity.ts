import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn({ type: 'int', name: 'orderNumber' })
  orderNumber: number;

  @Column({ type: 'date', name: 'orderDate' })
  orderDate: string;

  @Column({ type: 'date', name: 'requiredDate' })
  requiredDate: string;

  @Column({ type: 'date', name: 'shippedDate', nullable: true })
  shippedDate?: string | null;

  @Column({ type: 'varchar', length: 15, name: 'status' })
  status: string;

  @Column({ type: 'text', name: 'comments', nullable: true })
  comments?: string | null;

  @Column({ type: 'int', name: 'customerNumber' })
  customerNumber: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerNumber' })
  customer: Customer;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details: OrderDetail[];
}
