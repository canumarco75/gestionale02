import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportExportService {
  exportCsv(resource: string) {
    return {
      resource,
      format: 'csv',
      status: 'pending'
    };
  }

  exportPdf(resource: string) {
    return {
      resource,
      format: 'pdf',
      status: 'pending'
    };
  }

  exportExcel(resource: string) {
    return {
      resource,
      format: 'excel',
      status: 'pending'
    };
  }
}
