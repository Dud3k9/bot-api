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
  startBot(): string {
    this.schedulerService.startBotJob();
    return "Bot started";
  }

  @Get("stop")
  stopBot(): string {
    this.schedulerService.stopBotJob();
    return "Bot stopped";
  }
}
