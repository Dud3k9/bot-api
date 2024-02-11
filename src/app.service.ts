import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('45 * * * * *')
  handleCron() {
    console.log('cron-test');
    this.logger.debug('cron-test');
  }
}
