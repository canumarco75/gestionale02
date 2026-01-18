import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../db/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
  ) {}

  findAll() {
    return this.productsRepository.find({
      relations: ['productLine']
    });
  }

  findOne(productCode: string) {
    return this.productsRepository.findOne({
      where: { productCode },
      relations: ['productLine', 'orderDetails']
    });
  }

  create(payload: Partial<Product>) {
    return this.productsRepository.save(payload);
  }

  update(productCode: string, payload: Partial<Product>) {
    return this.productsRepository.save({
      ...payload,
      productCode
    });
  }

  remove(productCode: string) {
    return this.productsRepository.delete(productCode);
  }
}
