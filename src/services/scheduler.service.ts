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

  async status() {
    return {
      isWorking: this.schedulerRegistry.getCronJob("bot").running,
      history: Object.fromEntries(this.botService.history),
    };
  }

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
    try {
      console.log("cron started");
      await this.botService.tryBookPlaces();
    } catch (err) {
      console.log(err);
    }
  }
}
