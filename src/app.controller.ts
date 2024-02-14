import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get("start-bot")
  startBot(): string {
    this.appService.startBot();
    return "Bot started";
  }

  @Get("stop-bot")
  stopBot(): string {
    this.appService.stopBot();
    return "Bot stopped";
  }
}
