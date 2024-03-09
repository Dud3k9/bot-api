import { Controller, Get } from "@nestjs/common";
import { SchedulerService } from "../services/scheduler.service";
import { BotService } from "../services/bot.service";

@Controller("bot")
export class AppController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private botService: BotService
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
}
