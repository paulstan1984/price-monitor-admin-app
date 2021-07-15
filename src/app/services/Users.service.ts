import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { UsersSearchRequest } from '../models/UsersSearchRequest';
import { UsersSearchResponse } from '../models/UsersSearchResponse';
import { ServiceBase } from './ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ServiceBase {

  private ApiURL = environment.ApiURL + 'users';

  constructor(http: HttpClient) { super (http); }

  public list(startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<User[]> {

    startCallback();

    return this.http
      .get<User[]>(this.ApiURL,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<User[]>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public search(searchRequest: UsersSearchRequest, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<UsersSearchResponse> {

    startCallback();

    return this.http
      .post<UsersSearchResponse>(this.ApiURL, searchRequest, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<UsersSearchResponse>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public save(product: User, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<User> {

    startCallback();

    let url = this.ApiURL;
    if(product!.id > 0){
      url += ('/' + product.id);
    }

    return this.http
      .put<User>(url, product,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<User>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

  public delete(product: User, startCallback: () => void, endCallback: () => void, errorHandler: (error: HttpErrorResponse) => void): Observable<any> {

    startCallback();

    let url = this.ApiURL + '/' + product.id;
    
    return this.http
      .delete(url,  { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse, caught: Observable<any>) => {
          endCallback();
          errorHandler(error);
          return caught;
        })
      );
  }

}
