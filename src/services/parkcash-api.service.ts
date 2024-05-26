import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { Moment } from "moment";
import { EMPTY, Observable, catchError, map, of, switchMap, tap } from "rxjs";
import { HttpResponse } from "../interfaces/response.interface";
import { Token } from "../interfaces/token.interface";
import {
  ReservedPlaces,
  SearchPlacesResponse,
} from "../interfaces/places.interface";
import { log } from "console";
import * as moment from "moment";
import { userConfig } from "../config";

@Injectable()
export class ParkCashApi {
  token: string | undefined = undefined;
  constructor(private readonly httpService: HttpService) {}

  searchPlaces(day: Moment): Observable<HttpResponse<SearchPlacesResponse>> {
    return this.getToken().pipe(
      switchMap((token) =>
        this.httpService.get<HttpResponse<SearchPlacesResponse>>(
          "https://app.parkcash.io/api/ParkingSpots/search",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              Latitude: 52.1856386,
              Longitude: 20.9880283,
              RadiusInMeters: 100,
              Start: moment(day).toISOString(),
              End: moment(day).add(1, "day").toISOString(),
            },
          }
        )
      ),
      map((response) => response.data)
    );
  }

  bookPlace(
    day: Moment,
    place: string
  ): Observable<HttpResponse<SearchPlacesResponse>> {
    return this.getToken().pipe(
      tap(() => {
        log(moment(day).toISOString());
        log(moment(day).add(1, "day").toISOString());
        log(place);
      }),
      switchMap((token) =>
        this.httpService
          .post<HttpResponse<SearchPlacesResponse>>(
            `https://app.parkcash.io/api/ParkingSpots/${place}/reservations`,
            {
              start: moment(day).toISOString(),
              end: moment(day).add(1, "day").toISOString(),
              vehicleId: userConfig.vehicleId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .pipe(
            catchError((error) => {
              log(error);
              return EMPTY;
            })
          )
      ),
      map((response) => response.data),
      catchError((error) => {
        log(error);
        return EMPTY;
      })
    );
  }

  reservedPlace(): Observable<HttpResponse<ReservedPlaces>> {
    return this.getToken().pipe(
      switchMap((token) =>
        this.httpService.get<HttpResponse<ReservedPlaces>>(
          `https://app.parkcash.io/api/Users/reservations?SieveModel.Filters=`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ),
      map((response) => response.data)
    );
  }

  private getToken(): Observable<string> {
    return of(this.token).pipe(
      switchMap((token) => {
        return !!token
          ? of(token)
          : this.httpService
              .post<HttpResponse<Token>>(
                "https://app.parkcash.io/api/Sessions/native",
                {
                  login: userConfig.email,
                  password: userConfig.password,
                }
              )
              .pipe(
                map((response) => response.data.result.jwt),
                tap((newToken) => {
                  this.token = newToken;
                  log("took new token");
                })
              );
      })
    );
  }
}
