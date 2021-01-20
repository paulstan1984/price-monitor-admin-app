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
    this.stores.map(s => this.Unedit(s));

    let newStore = { InEdit: true } as Store;
    this.backupStore = Object.assign({}, newStore);
    this.stores.push(newStore);
  }

  protected Unedit(s: Store){
    if (s.InEdit) {
      Object.assign(s, this.backupStore!);
    }

    if (!s.id) {
      this.stores.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditStore(store: Store, editable: boolean) {

    this.stores.map(s => this.Unedit(s));

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
    if (confirm('Confirmați ștergerea?')) {
      this.storesService.delete(store, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.loadStores();
        });
    }
  }
}
