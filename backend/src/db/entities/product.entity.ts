import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { ProductLine } from './product-line.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 15, name: 'productCode' })
  productCode: string;

  @Column({ type: 'varchar', length: 70, name: 'productName' })
  productName: string;

  @Column({ type: 'varchar', length: 50, name: 'productLine' })
  productLineCode: string;

  @Column({ type: 'varchar', length: 10, name: 'productScale' })
  productScale: string;

  @Column({ type: 'varchar', length: 50, name: 'productVendor' })
  productVendor: string;

  @Column({ type: 'text', name: 'productDescription' })
  productDescription: string;

  @Column({ type: 'smallint', name: 'quantityInStock' })
  quantityInStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'buyPrice' })
  buyPrice: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'MSRP' })
  msrp: string;

  @ManyToOne(() => ProductLine, (line) => line.products)
  @JoinColumn({ name: 'productLine' })
  productLine: ProductLine;

  @OneToMany(() => OrderDetail, (detail) => detail.product)
  orderDetails: OrderDetail[];
}
