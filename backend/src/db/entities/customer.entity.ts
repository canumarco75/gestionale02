import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Order } from './order.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryColumn({ type: 'int', name: 'customerNumber' })
  customerNumber: number;

  @Column({ type: 'varchar', length: 50, name: 'customerName' })
  customerName: string;

  @Column({ type: 'varchar', length: 50, name: 'contactLastName' })
  contactLastName: string;

  @Column({ type: 'varchar', length: 50, name: 'contactFirstName' })
  contactFirstName: string;

  @Column({ type: 'varchar', length: 50, name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', length: 50, name: 'addressLine1' })
  addressLine1: string;

  @Column({ type: 'varchar', length: 50, name: 'addressLine2', nullable: true })
  addressLine2?: string | null;

  @Column({ type: 'varchar', length: 50, name: 'city' })
  city: string;

  @Column({ type: 'varchar', length: 50, name: 'state', nullable: true })
  state?: string | null;

  @Column({ type: 'varchar', length: 15, name: 'postalCode', nullable: true })
  postalCode?: string | null;

  @Column({ type: 'varchar', length: 50, name: 'country' })
  country: string;

  @Column({ type: 'int', name: 'salesRepEmployeeNumber', nullable: true })
  salesRepEmployeeNumber?: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'creditLimit', nullable: true })
  creditLimit?: string | null;

  @ManyToOne(() => Employee, (employee) => employee.customers)
  @JoinColumn({ name: 'salesRepEmployeeNumber' })
  salesRep?: Employee | null;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
