import {
  Controller,
  Get,
  OnApplicationBootstrap
} from "@nestjs/common";
import { SchedulerService } from "../services/scheduler.service";

@Controller("bot")
export class AppController implements OnApplicationBootstrap {
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

  @Get("test")
  test() {
    return this.schedulerService.oneTimeBooking();
  }

  constructor(private readonly schedulerService: SchedulerService) {}
  onApplicationBootstrap() {
    this.startBot();
  }
}
