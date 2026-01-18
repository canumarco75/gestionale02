import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryColumn({ type: 'int', name: 'customerNumber' })
  customerNumber: number;

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'checkNumber' })
  checkNumber: string;

  @Column({ type: 'date', name: 'paymentDate' })
  paymentDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'amount' })
  amount: string;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  @JoinColumn({ name: 'customerNumber' })
  customer: Customer;
}
