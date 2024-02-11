import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  test() {
    setInterval(() => {
      console.log('test interval');
    }, 2000);
  }

  // @Cron('45 * * * * *')
  // handleCron() {
  //   console.log('cron-test');
  //   this.logger.debug('cron-test');
  // }
}
