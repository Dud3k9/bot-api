import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { BotService } from "./bot.service";

@Injectable()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private botService: BotService
  ) {}

  async startBotJob() {
    this.schedulerRegistry.getCronJob("bot");
    await this.botService.initBot();
    this.schedulerRegistry.getCronJob("bot").start();
  }

  async stopBotJob() {
    this.schedulerRegistry.getCronJob("bot").stop();
    this.botService.closeBot();
  }

  @Cron("0 */5 * * * *", {
    // every minute
    name: "bot",
    disabled: true,
  })
  async botLoop() {
    await this.botService.tryBookPlaces();
  }

  @Cron("10 0 0 * * *", {
    // 10 seconds past 00:00
    name: "Bot",
    disabled: true,
  })
  async botNewPlacesTime() {
    await this.botService.tryBookPlaces();
  }
}
