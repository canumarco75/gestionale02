import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  listOrdersSummaryByCustomer() {
    return this.dataSource.query('SELECT * FROM vw_riepilogo_ordini_clienti');
  }

  listWarehouseStatus() {
    return this.dataSource.query('SELECT * FROM vw_stato_magazzino_prodotti');
  }

  listSalesByEmployee() {
    return this.dataSource.query('SELECT * FROM vw_vendite_per_venditore');
  }

  topCustomers(limit: number) {
    return this.dataSource.query('CALL sp_top_clienti_per_vendite(?)', [limit]);
  }

  monthlySalesReport(year: number, month: number, startEmployee: number, endEmployee: number) {
    return this.dataSource.query('CALL sp_report_vendite_mensili(?, ?, ?, ?)', [
      startEmployee,
      endEmployee,
      year,
      month
    ]);
  }
}
