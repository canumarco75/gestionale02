import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'productlines' })
export class ProductLine {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'productLine' })
  productLine: string;

  @Column({ type: 'varchar', length: 4000, name: 'textDescription', nullable: true })
  textDescription?: string | null;

  @Column({ type: 'mediumtext', name: 'htmlDescription', nullable: true })
  htmlDescription?: string | null;

  @Column({ type: 'mediumblob', name: 'image', nullable: true })
  image?: Buffer | null;

  @OneToMany(() => Product, (product) => product.productLine)
  products: Product[];
}
