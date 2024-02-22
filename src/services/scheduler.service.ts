import { Injectable } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { BotService } from "./bot.service";
import { log } from "console";

@Injectable()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private botService: BotService
  ) {}

  async startBotJob() {
    if (!this.botService.page) {
      await this.botService.initBot();
      this.schedulerRegistry.getCronJob("bot").start();
      console.log("bot started");
    }
  }

  async stopBotJob() {
    this.schedulerRegistry.getCronJob("bot").stop();
    this.botService.closeBot();
  }

  @Cron("10 */5 * * * *", {
    // every minute
    name: "bot",
    disabled: true,
  })
  async botLoop() {
    console.log("cron started");

    await this.botService.tryBookPlaces();
  }

  // @Cron("10 0 0 * * *", {
  //   // 10 seconds past 00:00
  //   name: "bot",
  //   disabled: true,
  // })
  // async botNewPlacesTime() {
  //   console.log("one time cron started");
  //   await this.botService.tryBookPlaces();
  // }
}
