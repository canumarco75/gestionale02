import { Controller, Get, Param } from '@nestjs/common';
import { ImportExportService } from './import-export.service';

@Controller('export')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Get('csv/:resource')
  exportCsv(@Param('resource') resource: string) {
    return this.importExportService.exportCsv(resource);
  }

  @Get('pdf/:resource')
  exportPdf(@Param('resource') resource: string) {
    return this.importExportService.exportPdf(resource);
  }

  @Get('excel/:resource')
  exportExcel(@Param('resource') resource: string) {
    return this.importExportService.exportExcel(resource);
  }
}
