import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./controlers/app.controller";
import { BotService } from "./services/bot.service";
import { SchedulerService } from "./services/scheduler.service";
import { ParkCashApi } from "./services/parkcash-api.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { DevtoolsModule } from "@nestjs/devtools-integration";

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== "production",
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [SchedulerService, BotService, ParkCashApi],
})
export class AppModule {}
