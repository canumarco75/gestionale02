import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../db/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>
  ) {}

  findAll() {
    return this.ordersRepository.find({
      relations: ['customer', 'details', 'details.product']
    });
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
