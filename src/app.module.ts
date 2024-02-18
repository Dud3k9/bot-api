import { Module } from '@nestjs/common';
import { AppController } from './controlers/app.controller';
import { AppService } from './services/app.service';
import { Cron, ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './services/scheduler.service';
import { BotService } from './services/bot.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SchedulerService, BotService],
})
export class AppModule {}
