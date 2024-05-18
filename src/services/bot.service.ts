import { Injectable } from "@nestjs/common";
import { ParkCashApi } from "./parkcash-api.service";
import { log } from "console";
import * as moment from "moment";
import {
  map,
  switchMap,
  merge,
  combineLatest,
  of,
  mergeMap,
  tap,
  Observable,
} from "rxjs";
import { HistoryItem } from "../interfaces/history.interface";

@Injectable()
export class BotService {
  constructor(private parkCashApi: ParkCashApi) {}

  bookPlaces() {
    return this.parkCashApi.reservedPlace().pipe(
      map((x) =>
        x.result.entries
          .filter(
            (reservation) =>
              reservation.status === 3 || reservation.status === 4
          )
          .map((reservation) => moment(reservation.startTimestamp))
      ),
      map((reservedDays) =>
        this.getDays().filter(
          (day) =>
            !reservedDays.some((reservedDay) => reservedDay.isSame(day, "day"))
        )
      ),
      tap((x) => log(x)),
      switchMap((daysToReserve) => {
        return !!daysToReserve.length
          ? merge(
              ...daysToReserve.map((day) =>
                combineLatest([this.parkCashApi.searchPlaces(day), of(day)])
              )
            ).pipe(
              mergeMap(([places, day]) => {
                const parkingId: string | undefined =
                  places.result.userParkings[0].spots.find(
                    (spot) => spot.isFree
                  ).id;
                return parkingId
                  ? this.parkCashApi
                      .bookPlace(day, parkingId)
                      .pipe(tap((x) => log(x)))
                  : of("no free places at: " + day.toISOString()).pipe(
                      tap((x) => log(x))
                    );
              })
            )
          : of("no places to book").pipe(tap((x) => log(x)));
      })
    );
  }

  getReservations(): Observable<HistoryItem[]> {
    return this.parkCashApi.reservedPlace().pipe(
      map((reservationsResponse) =>
        reservationsResponse.result.entries.map((reservation) => ({
          day: moment(reservation.startTimestamp).toISOString(),
          place: reservation.spotNumber,
          entry: reservation,
        }))
      )
    );
  }

  private getDays(): moment.Moment[] {
    let days = [];
    for (let index = 13; index >= 0; index--) {
      const day = moment(new Date())
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .add(index, "day");
      if (day.weekday() != 6 && day.weekday() != 0) days.push(day);
    }
    return days;
  }
}
