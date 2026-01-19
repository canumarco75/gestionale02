import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../db/entities/product.entity';

const PRODUCT_SORT_COLUMNS = new Set([
  'productCode',
  'productName',
  'productLineCode',
  'productScale',
  'productVendor',
  'quantityInStock',
  'buyPrice',
  'msrp'
]);

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
  ) {}

  async findAllPaged(options: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    search?: string;
  }) {
    const { page, pageSize, sortBy, sortDir, search } = options;
    const orderBy = PRODUCT_SORT_COLUMNS.has(sortBy) ? sortBy : 'productName';

    const query = this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.productLine', 'productLine')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(`products.${orderBy}`, sortDir);

    if (search) {
      query.andWhere(
        `(
          products.productCode LIKE :search OR
          products.productName LIKE :search OR
          products.productVendor LIKE :search OR
          products.productLineCode LIKE :search
        )`,
        { search: `%${search}%` }
      );
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize
    };
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
