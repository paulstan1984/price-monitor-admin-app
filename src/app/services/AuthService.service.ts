import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  isLoggedIn(cbkNotLogedIn: () => void) {
    let token = localStorage.getItem(environment.PriceMonitorToken);

    if (!token) {
      cbkNotLogedIn();
    }
  }

  logout() {
    localStorage.removeItem(environment.PriceMonitorToken);
  }

  login(password: string, errorHandler: (error: HttpErrorResponse) => void) {

    this.http
      .post(environment.ApiURL + 'login', { Password: password })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          errorHandler(error);
          return caught;
        })
      );
  }
}
