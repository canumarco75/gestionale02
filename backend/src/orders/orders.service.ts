import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../db/entities/order.entity';

const ORDER_SORT_COLUMNS = new Set([
  'orderNumber',
  'orderDate',
  'requiredDate',
  'shippedDate',
  'status',
  'customerNumber'
]);

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>
  ) {}

  async findAllPaged(options: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    search?: string;
  }) {
    const { page, pageSize, sortBy, sortDir, search } = options;
    const orderBy = ORDER_SORT_COLUMNS.has(sortBy) ? sortBy : 'orderDate';

    const query = this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.customer', 'customer')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(`orders.${orderBy}`, sortDir);

    if (search) {
      query.andWhere(
        '(orders.status LIKE :search OR orders.orderNumber LIKE :search OR orders.customerNumber LIKE :search)',
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

  findOne(orderNumber: number) {
    return this.ordersRepository.findOne({
      where: { orderNumber },
      relations: ['customer', 'details', 'details.product']
    });
  }

  create(payload: Partial<Order>) {
    return this.ordersRepository.save(payload);
  }

  update(orderNumber: number, payload: Partial<Order>) {
    return this.ordersRepository.save({
      ...payload,
      orderNumber
    });
  }

  remove(orderNumber: number) {
    return this.ordersRepository.delete(orderNumber);
  }
}
