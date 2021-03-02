import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/models/Product';
import { ProductsSearchRequest } from 'src/app/models/ProductsSearchRequest';
import { ProductsSearchResponse } from 'src/app/models/ProductsSearchResponse';
import { AuthService } from 'src/app/services/Auth.service';
import { ProductsService } from 'src/app/services/Products.service';
import { LoggedInComponent } from '../LoggedInComponent';

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


  multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2020",
          "value": 62000000
        }
      ]
    }
  ];

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  products: Product[] = [];

  constructor(
    authService: AuthService,
    private productsService: ProductsService,
    router: Router,
    private calendar: NgbCalendar, public dateFormatter: NgbDateParserFormatter
  ) {
    super(authService, router);

    this.productsService.setAuthToken(this.authService.getToken());
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

  DoFilter(f: NgForm) {
    if (!this.validateForm(f)) {
      return;
    }

  }

  //#region Date Selection
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
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
    }

  }

  removeProduct(prod: Product) {
    this.products = this.products.filter(p => p.id != prod.id);
  }
  //#endregion
}