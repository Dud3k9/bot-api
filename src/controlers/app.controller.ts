import { Controller, Get } from "@nestjs/common";
import { SchedulerService } from "../services/scheduler.service";
import { BotService } from "../services/bot.service";

@Controller()
export class AppController {
  constructor(private readonly schedulerService: SchedulerService,  private botService: BotService) {}

  @Get("status")
  status(): string {
    return "API Działa";
  }

  @Get("start-bot")
  startBot(): string {
    this.schedulerService.startBotJob();
    return "Bot started";
  }

  @Get("stop-bot")
  stopBot(): string {
    this.schedulerService.stopBotJob();
    return "Bot stopped";
  }


}
