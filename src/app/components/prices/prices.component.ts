import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Price } from 'src/app/models/Price';
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

  public prices: Price[] = [];
  public backupPrice: Price | undefined = undefined;
  public products: Product[] = [];
  public stores: Store[] = [];

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

    this.loadPrices();
    this.loadCategories();
    this.loadProducts();
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
  loadPrices() {
    this.pricesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(prices => {
        this.setLoading(false);
        this.prices = prices;
      })
  }

  NewPrice() {
    this.prices.map(s => this.UneditPrice(s));

    let newPrice = { InEdit: true } as Price;
    this.backupPrice = Object.assign({}, newPrice);
    this.prices.push(newPrice);
  }

  protected UneditPrice(s: Price){
    if (s.InEdit) {
      Object.assign(s, this.backupPrice!);
    }

    if (!s.id) {
      this.prices.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditPrice(price: Price, editable: boolean) {

    this.prices.map(s => this.UneditPrice(s));

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
        this.loadPrices();
      })
  }

  DeletePrice(price: Price) {
    if (confirm('Confirmați ștergerea?')) {
      this.pricesService.delete(price, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.loadPrices();
        });
    }
  }
  //#endregion
}
