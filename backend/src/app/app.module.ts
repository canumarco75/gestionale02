import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomersModule } from '../customers/customers.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { ReportsModule } from '../reports/reports.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ImportExportModule } from '../import-export/import-export.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 3306),
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? 'dbclassicmodels',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: false,
        timezone: 'Z'
      })
    }),
    AuthModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
    ReportsModule,
    DashboardModule,
    ImportExportModule
  ]
})
export class AppModule {}
