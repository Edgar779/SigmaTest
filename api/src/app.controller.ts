import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dropDatabase')
  @Public()
  async dropDatabase() {
    await this.appService.dropDatabase();
  }
}