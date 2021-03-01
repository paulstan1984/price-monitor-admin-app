import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Store } from 'src/app/models/Store';
import { AuthService } from 'src/app/services/Auth.service';
import { CategoriesService } from 'src/app/services/Categories.service';
import { StoresService } from 'src/app/services/Stores.service';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoggedInComponent implements OnInit {

  public stores: Store[] = [];
  public backupStore: Store | undefined = undefined;

  public categories: Category[] = [];
  public backupCategory: Category | undefined = undefined;

  // https://swimlane.gitbook.io/ngx-charts/
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  data = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

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
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];


  constructor(
    authService: AuthService,
    router: Router,
    private storesService: StoresService,
    private categoriesService: CategoriesService
  ) {
    super(authService, router);

    this.storesService.setAuthToken(this.authService.getToken());
    this.categoriesService.setAuthToken(this.authService.getToken());
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.loadStores();
    this.loadCategories();
  }

  //#region Stores
  loadStores() {
    this.storesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(stores => {
        this.setLoading(false);
        this.stores = stores;
      })
  }

  NewStore() {
    this.stores.map(s => this.UneditStore(s));

    let newStore = { InEdit: true } as Store;
    this.backupStore = Object.assign({}, newStore);
    this.stores.push(newStore);
  }

  protected UneditStore(s: Store) {
    if (s.InEdit) {
      Object.assign(s, this.backupStore!);
    }

    if (!s.id) {
      this.stores.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditStore(store: Store, editable: boolean) {

    this.stores.map(s => this.UneditStore(s));

    if (editable) {
      this.backupStore = Object.assign({}, store);
    } else {
      this.backupStore = undefined;
    }

    store.InEdit = editable;
  }

  SaveStore(store: Store) {
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
  //#endregion

  //#region Categories
  loadCategories() {
    this.categoriesService
      .list(() => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(categories => {
        this.setLoading(false);
        this.categories = categories;
      })
  }

  NewCategory() {
    this.categories.map(s => this.UneditCategory(s));

    let newCategory = { InEdit: true } as Category;
    this.backupCategory = Object.assign({}, newCategory);
    this.categories.push(newCategory);
  }

  protected UneditCategory(s: Category) {
    if (s.InEdit) {
      Object.assign(s, this.backupCategory!);
    }

    if (!s.id) {
      this.categories.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditCategory(categ: Category, editable: boolean) {

    this.categories.map(s => this.UneditCategory(s));

    if (editable) {
      this.backupCategory = Object.assign({}, categ);
    } else {
      this.backupCategory = undefined;
    }

    categ.InEdit = editable;
  }

  SaveCategory(categ: Category) {
    this.categoriesService.save(categ, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.loadCategories();
      })
  }

  DeleteCategory(categ: Category) {
    if (confirm('Confirmați ștergerea?')) {
      this.categoriesService.delete(categ, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.loadCategories();
        });
    }
  }
  //#endregion
}
