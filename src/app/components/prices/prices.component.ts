import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Price } from 'src/app/models/Price';
import { PricesSearchRequest } from 'src/app/models/PricesSearchRequest';
import { PricesSearchResponse } from 'src/app/models/PricesSearchResponse';
import { Product } from 'src/app/models/Product';
import { Store } from 'src/app/models/Store';
import { AuthService } from 'src/app/services/Auth.service';
import { PricesService } from 'src/app/services/Prices.service';
import { ProductsService } from 'src/app/services/Products.service';
import { StoresService } from 'src/app/services/Stores.service';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent extends LoggedInComponent implements OnInit {

  public backupPrice: Price | undefined = undefined;
  public products: Product[] = [];
  public stores: Store[] = [];
  public searchRequest: PricesSearchRequest = {
    page: 1
  } as PricesSearchRequest
  public searchResponse: PricesSearchResponse | undefined = undefined;

  currentPage = 1;

  constructor(
    authService: AuthService,
    router: Router,
    private pricesService: PricesService,
    private storesService: StoresService,
    private productsService: ProductsService
  ) {
    super(authService, router);

    this.pricesService.setAuthToken(this.authService.getToken());
    this.storesService.setAuthToken(this.authService.getToken());
    this.productsService.setAuthToken(this.authService.getToken());
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.loadCategories();
    this.loadProducts();
    
    this.searchRequest.order_by = 'created_at';
    this.searchRequest.order_by_dir = 'DESC';
    this.searchPrices();
  }

  loadCategories() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  loadProducts() {
    this.productsService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(products => {
        this.setLoading(false);
        this.products = products;
      })
  }

  //#region prices

  OrderBy(field: string) {
    if (this.searchRequest.order_by == field) {
      if (this.searchRequest.order_by_dir == 'ASC') {
        this.searchRequest.order_by_dir = 'DESC';
      } else {
        this.searchRequest.order_by_dir = 'ASC'
      }
    } else {
      this.searchRequest.order_by = field;
      this.searchRequest.order_by_dir = 'ASC';
    }

    this.searchPrices();
  }

  DoFilter(f: NgForm) {
    if (!this.validateForm(f)) {
      return;
    }

    this.searchPrices();
  }

  ResetFilters() {
    delete(this.searchRequest.product);
    delete(this.searchRequest.store);
    this.searchPrices();
  }

  searchPrices() {
    this.pricesService
      .search(this.searchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.searchResponse = response;
        this.currentPage = response.page;
      })
  }

  setPage(pageInfo: any) {
    this.searchRequest.page = pageInfo.page;
    this.searchPrices();
  }

  NewPrice() {
    this.searchResponse?.results.map(s => this.UneditPrice(s))

    let newPrice = { InEdit: true } as Price;
    this.backupPrice = Object.assign({}, newPrice);
    this.searchResponse?.results.push(newPrice);
  }

  protected UneditPrice(s: Price) {
    if (s.InEdit) {
      Object.assign(s, this.backupPrice!);
    }

    if (!s.id) {
      this.searchResponse?.results.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditPrice(price: Price, editable: boolean) {

    this.searchResponse?.results.map(s => this.UneditPrice(s));

    if (editable) {
      this.backupPrice = Object.assign({}, price);
    } else {
      this.backupPrice = undefined;
    }

    price.InEdit = editable;
  }

  SavePrice(price: Price) {
    this.pricesService.save(price, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.searchPrices();
      })
  }

  DeletePrice(price: Price) {
    if (confirm('Confirmați ștergerea?')) {
      this.pricesService.delete(price, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.searchPrices();
        });
    }
  }
  //#endregion
}
