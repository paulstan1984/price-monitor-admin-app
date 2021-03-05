import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StatisticResponse, StatisticsRequest } from '../models/StatisticsRequest';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'statistics';

  constructor(http: HttpClient) { super (http); }

  public getStatistics(request: StatisticsRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<StatisticResponse[]> {

    startCallback();

    return this.http
      .post<StatisticResponse[]>(this.ApiURL, request, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<StatisticResponse[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }
}
