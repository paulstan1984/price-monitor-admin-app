import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/Auth.service';
import { ProductsService } from 'src/app/services/Products.service';
import { environment } from 'src/environments/environment';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends LoggedInComponent implements OnInit {

  public products: Product[] = [];
  public backupProduct: Product | undefined = undefined;

  constructor(
    authService: AuthService,
    router: Router,
    private productsService: ProductsService
  ) {
    super(authService, router);

    this.productsService.setAuthToken(this.authService.getToken());
  }

  DoLogout() {
    this.authService.logout();
    this.router.navigate([environment.LoginRoute])
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.loadProducts();
  }

  //#region products
  loadProducts() {
    this.productsService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(products => {
        this.setLoading(false);
        this.products = products;
      })
  }

  NewProduct() {
    this.products.map(s => this.UneditProduct(s));

    let newProduct = { InEdit: true } as Product;
    this.backupProduct = Object.assign({}, newProduct);
    this.products.push(newProduct);
  }

  protected UneditProduct(s: Product){
    if (s.InEdit) {
      Object.assign(s, this.backupProduct!);
    }

    if (!s.id) {
      this.products.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditProduct(product: Product, editable: boolean) {

    this.products.map(s => this.UneditProduct(s));

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
        this.loadProducts();
      })
  }

  DeleteProduct(product: Product) {
    if (confirm('Confirmați ștergerea?')) {
      this.productsService.delete(product, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.loadProducts();
        });
    }
  }
  //#endregion
}
