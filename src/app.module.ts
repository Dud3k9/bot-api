import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./controlers/app.controller";
import { BotService } from "./services/bot.service";
import { SchedulerService } from "./services/scheduler.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [SchedulerService, BotService],
})
export class AppModule {}
