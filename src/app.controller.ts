import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTimeInterceptor } from './core/interceptor/create-time.interceptor';

@Controller()
@UseInterceptors(CreateTimeInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
