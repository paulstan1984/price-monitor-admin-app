import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ServiceBase {

  constructor(http: HttpClient) { 
    super(http);
  }

  isLoggedIn(cbkNotLogedIn: () => void) {
    let token = localStorage.getItem(environment.PriceMonitorToken);

    if (!token) {
      cbkNotLogedIn();
    }
  }

  logout() : Observable<any> {

    super.setAuthToken(this.getToken());

    return this.http
      .post(environment.ApiURL + 'logout', { }, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          throw error;
        })
    );
  }

  login(username: string, password: string, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<LoginResponse> {

    startCallback();

    return this.http
      .post(environment.ApiURL + 'login', { Username: username, Password: password })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  setToken(token: string) {
    localStorage.setItem(environment.PriceMonitorToken, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(environment.PriceMonitorToken);
  }
}


export interface LoginResponse {
  token: string;
}
