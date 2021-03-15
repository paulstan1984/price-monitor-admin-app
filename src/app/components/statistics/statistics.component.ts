import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/models/Product';
import { ProductsSearchRequest } from 'src/app/models/ProductsSearchRequest';
import { ProductsSearchResponse } from 'src/app/models/ProductsSearchResponse';
import { Store } from 'src/app/models/Store';
import { AuthService } from 'src/app/services/Auth.service';
import { ProductsService } from 'src/app/services/Products.service';
import { StoresService } from 'src/app/services/Stores.service';
import { LoggedInComponent } from '../LoggedInComponent';
import { StatisticsRequest, StatisticsResponse } from 'src/app/models/StatisticsRequest';
import { StatisticsService } from 'src/app/services/Statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styles: [`
    .form-group.hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
})
export class StatisticsComponent extends LoggedInComponent implements OnInit {

  // https://swimlane.gitbook.io/ngx-charts/
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Data';
  showYAxisLabel = true;
  yAxisLabel = 'Price';


  multi: StatisticsResponse[] | undefined;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  products: Product[] = [];
  stores: Store[] = [];
  statisticsRequest: StatisticsRequest = {
    ProductsIds: [] as number[],
    StoresIds: [] as number[]
  } as StatisticsRequest;

  constructor(
    authService: AuthService,
    private productsService: ProductsService,
    private storesService: StoresService,
    private statisticsService: StatisticsService,
    router: Router,
    private calendar: NgbCalendar, public dateFormatter: NgbDateParserFormatter
  ) {
    super(authService, router);

    this.productsService.setAuthToken(this.authService.getToken());
    this.storesService.setAuthToken(this.authService.getToken());
    this.statisticsService.setAuthToken(this.authService.getToken());

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

    this.statisticsRequest.StartDate = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day);
    this.statisticsRequest.EndDate = new Date(this.toDate.year, this.toDate.month, this.toDate.day);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.stores = response;
        this.setLoading(false);
      });
  }

  DoFilter(f: NgForm) {
    if (!this.validateForm(f)) {
      return;
    }

    this.statisticsService.getStatistics(this.statisticsRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        console.log(response);
        this.setLoading(false);
        this.multi = response;
      });
  }

  //#region Date Selection
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.statisticsRequest.StartDate = new Date(date.year, date.month, date.day);
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.statisticsRequest.EndDate = new Date(date.year, date.month, date.day);
    } else {
      this.toDate = null;
      this.fromDate = date;

      this.statisticsRequest.EndDate = undefined;
      this.statisticsRequest.StartDate = new Date(date.year, date.month, date.day);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.dateFormatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  //#endregion

  //#region Product Selection
  productFormatter = (product: Product) => product.name;

  SearchProduct = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term =>
      this.productsService
        .search({ name: term, page: 1 } as ProductsSearchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .pipe(
          catchError(() => {
            this.setLoading(false);
            return of({ results: [] as Product[] } as ProductsSearchResponse);
          }),
          tap(() => this.setLoading(false))
        )
    ),
    map(response => response.results)
  );

  selectProduct(p: any) {

    const product = p.item as Product;
    if (!this.products.find(p => p.id == product.id)) {
      this.products.push(product);
      this.statisticsRequest.ProductsIds.push(product.id);
    }

  }

  removeProduct(prod: Product) {
    this.products = this.products.filter(p => p.id != prod.id);
    this.statisticsRequest.ProductsIds = this.statisticsRequest.ProductsIds.filter(pId => pId != prod.id)
  }
  //#endregion

  //#region Stores
  toggleStore(s: any, store: Store) {
    if(s.currentTarget.checked) {
      this.statisticsRequest.StoresIds.push(store.id);
    }
    else {
      this.statisticsRequest.StoresIds = this.statisticsRequest.StoresIds.filter(sId => sId != store.id);
    }
  }
  //#endregion
}
