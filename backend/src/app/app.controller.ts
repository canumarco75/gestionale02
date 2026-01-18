import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      status: 'ok',
      message: 'API attiva'
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok'
    };
  }
}
