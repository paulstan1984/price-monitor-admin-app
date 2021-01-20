import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/Store';
import { AuthService } from 'src/app/services/Auth.service';
import { StoresService } from 'src/app/services/Stores.service';
import { environment } from 'src/environments/environment';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoggedInComponent implements OnInit {

  public stores: Store[] = [];
  public newStore: Store | undefined = undefined;
  public backupStore: Store | undefined = undefined;

  constructor(
    authService: AuthService,
    router: Router,
    private storesService: StoresService
  ) {
    super(authService, router);

    this.storesService.setAuthToken(this.authService.getToken());
  }

  DoLogout() {
    this.authService.logout();
    this.router.navigate([environment.LoginRoute])
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.loadStores();
  }

  loadStores() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  NewStore() {
    this.newStore = { InEdit: true } as Store;
  }

  EditStore(store: Store, editable: boolean) {

    this.stores.map(s => {
      if (s.InEdit) {
        Object.assign(s, this.backupStore!);
      }
      s.InEdit = false;
    });

    if (editable) {
      this.backupStore = Object.assign({}, store);
    } else {
      this.backupStore = undefined;
    }

    store.InEdit = editable;
  }

  DoSave(store: Store) {
    this.storesService.save(store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.loadStores();
      })
  }

  DeleteStore(store: Store) {
    this.storesService.delete(store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.loadStores();
      })
  }
}
