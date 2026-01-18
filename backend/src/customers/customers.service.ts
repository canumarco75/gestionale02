import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../db/entities/customer.entity';

const CUSTOMER_SORT_COLUMNS = new Set([
  'customerNumber',
  'customerName',
  'contactLastName',
  'contactFirstName',
  'city',
  'country',
  'creditLimit'
]);

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>
  ) {}

  async findAllPaged(options: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    search?: string;
  }) {
    const { page, pageSize, sortBy, sortDir, search } = options;
    const orderBy = CUSTOMER_SORT_COLUMNS.has(sortBy) ? sortBy : 'customerName';

    const query = this.customersRepository
      .createQueryBuilder('customers')
      .leftJoinAndSelect('customers.salesRep', 'salesRep')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(`customers.${orderBy}`, sortDir);

    if (search) {
      query.andWhere(
        `(
          customers.customerName LIKE :search OR
          customers.customerNumber LIKE :search OR
          customers.country LIKE :search OR
          customers.city LIKE :search OR
          customers.contactFirstName LIKE :search OR
          customers.contactLastName LIKE :search
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

  findOne(customerNumber: number) {
    return this.customersRepository.findOne({
      where: { customerNumber },
      relations: ['salesRep', 'orders', 'payments']
    });
  }

  create(payload: Partial<Customer>) {
    return this.customersRepository.save(payload);
  }

  update(customerNumber: number, payload: Partial<Customer>) {
    return this.customersRepository.save({
      ...payload,
      customerNumber
    });
  }

  remove(customerNumber: number) {
    return this.customersRepository.delete(customerNumber);
  }
}
