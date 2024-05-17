import { Controller, Get } from "@nestjs/common";
import { ParkCashApi } from "../services/parkcash-api.service";
import { SchedulerService } from "../services/scheduler.service";

@Controller("bot")
export class AppController {
  constructor(
    private readonly schedulerService: SchedulerService,
  ) {}

  @Get("status")
  status() {
    return this.schedulerService.status();
  }

  @Get("start")
  async startBot() {
    await this.schedulerService.startBotJob();
    return { isWorking: true };
  }

  @Get("stop")
  async stopBot() {
    await this.schedulerService.stopBotJob();
    return { isWorking: false };
  }

  // @Get("test")
  // test() {
  //   return this.schedulerService.bookPlaces();
  // }
}
