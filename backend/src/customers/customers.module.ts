import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
