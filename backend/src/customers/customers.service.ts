import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../db/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>
  ) {}

  findAll() {
    return this.customersRepository.find({
      relations: ['salesRep']
    });
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
