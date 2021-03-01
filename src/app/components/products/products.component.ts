import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Product } from 'src/app/models/Product';
import { ProductsSearchRequest } from 'src/app/models/ProductsSearchRequest';
import { ProductsSearchResponse } from 'src/app/models/ProductsSearchResponse';
import { AuthService } from 'src/app/services/Auth.service';
import { CategoriesService } from 'src/app/services/Categories.service';
import { ProductsService } from 'src/app/services/Products.service';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends LoggedInComponent implements OnInit {

  public backupProduct: Product | undefined = undefined;
  public categories: Category[] = [];
  public searchRequest: ProductsSearchRequest = {
    page: 1
  } as ProductsSearchRequest
  public searchResponse: ProductsSearchResponse | undefined = undefined;

  currentPage = 1;

  constructor(
    authService: AuthService,
    router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    super(authService, router);

    this.productsService.setAuthToken(this.authService.getToken());
    this.categoriesService.setAuthToken(this.authService.getToken());
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(categories => {
        this.setLoading(false);
        this.categories = categories;
      })
  }

  //#region products
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

    this.searchProducts();
  }

  DoFilter(f: NgForm) {
    if (!this.validateForm(f)) {
      return;
    }

    this.searchProducts();
  }

  ResetFilters() {
    delete(this.searchRequest.name);
    delete(this.searchRequest.category);
    this.searchProducts();
  }

  searchProducts() {
    this.productsService
      .search(this.searchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.searchResponse = response;
        this.currentPage = response.page;
      })
  }

  setPage(pageInfo: any) {
    this.searchRequest.page = pageInfo.page;
    this.searchProducts();
  }

  NewProduct() {
    this.searchResponse?.results.map(s => this.UneditProduct(s));

    let newProduct = { InEdit: true } as Product;
    this.backupProduct = Object.assign({}, newProduct);
    this.searchResponse?.results.push(newProduct);
  }

  protected UneditProduct(s: Product){
    if (s.InEdit) {
      Object.assign(s, this.backupProduct!);
    }

    if (!s.id) {
      this.searchResponse?.results.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditProduct(product: Product, editable: boolean) {

    this.searchResponse?.results.map(s => this.UneditProduct(s));

    if (editable) {
      this.backupProduct = Object.assign({}, product);
    } else {
      this.backupProduct = undefined;
    }

    product.InEdit = editable;
  }

  SaveProduct(product: Product) {
    this.productsService.save(product, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.searchProducts();
      })
  }

  DeleteProduct(product: Product) {
    if (confirm('Confirmați ștergerea?')) {
      this.productsService.delete(product, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.searchProducts();
        });
    }
  }
  //#endregion
}
