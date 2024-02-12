import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("test")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("start-bot")
  startBot(): string {
    this.appService.startService();
    return this.appService.getHello();
  }
}
