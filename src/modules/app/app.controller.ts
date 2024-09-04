import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AcceptEncoding } from '../../common/decorators/encoding.decorator';

@Controller()
@AcceptEncoding()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
