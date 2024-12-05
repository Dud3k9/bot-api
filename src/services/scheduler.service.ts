import { Injectable } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { EMPTY, catchError, map } from "rxjs";
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
        history,
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

  oneTimeBooking() {
    return this.botService.bookPlaces();
  }

  @Cron("15 */5 * * * *", {
    // every minute
    name: "bot",
    disabled: true,
  })
  async botLoop() {
    try {
      console.log("cron started");
      this.botService
        .bookPlaces()
        .pipe(
          catchError((error) => {
            console.log(error);
            return EMPTY;
          })
        )
        .subscribe();
    } catch (err) {
      console.log(err);
      console.log("restarted bot");
    }
  }
}
