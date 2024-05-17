import { Injectable } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { first, map } from "rxjs";
import { BotService } from "./bot.service";

@Injectable()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private botService: BotService
  ) {}

  async status() {
    return this.botService.getReservations().pipe(
      map((history) => ({
        isWorking: this.schedulerRegistry.getCronJob("bot").running,
          history
      }))
    );
  }

  async startBotJob() {
    this.schedulerRegistry.getCronJob("bot").start();
    console.log("bot started");
  }

  async stopBotJob() {
    this.schedulerRegistry.getCronJob("bot").stop();
    console.log("bot stoped");
  }

  @Cron("10 */5 * * * *", {
    // every minute
    name: "bot",
    disabled: true,
  })
  async botLoop() {
    try {
      console.log("cron started");
      await this.botService.bookPlaces().pipe(first()).subscribe();
    } catch (err) {
      console.log(err);
      console.log("restarted bot");
    }
  }
}
