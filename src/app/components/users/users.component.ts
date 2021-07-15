import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UsersSearchRequest } from 'src/app/models/UsersSearchRequest';
import { UsersSearchResponse } from 'src/app/models/UsersSearchResponse';
import { AuthService } from 'src/app/services/Auth.service';
import { CategoriesService } from 'src/app/services/Categories.service';
import { UsersService } from 'src/app/services/Users.service';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends LoggedInComponent implements OnInit {

  public backupUser: User | undefined = undefined;
  public searchRequest: UsersSearchRequest = {
    page: 1
  } as UsersSearchRequest
  public searchResponse: UsersSearchResponse | undefined = undefined;

  currentPage = 1;

  constructor(
    authService: AuthService,
    router: Router,
    private usersService: UsersService,
    private categoriesService: CategoriesService
  ) {
    super(authService, router);

    this.usersService.setAuthToken(this.authService.getToken());
    this.categoriesService.setAuthToken(this.authService.getToken());
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchUsers();
  }

  //#region users
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

    this.searchUsers();
  }

  DoFilter(f: NgForm) {
    if (!this.validateForm(f)) {
      return;
    }

    this.searchUsers();
  }

  ResetFilters() {
    delete(this.searchRequest.name);
    this.searchUsers();
  }

  searchUsers() {
    this.usersService
      .search(this.searchRequest, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.searchResponse = response;
        this.currentPage = response.page;
      })
  }

  setPage(pageInfo: any) {
    this.searchRequest.page = pageInfo.page;
    this.searchUsers();
  }

  NewUser() {
    this.searchResponse?.results.map(s => this.UneditUser(s));

    let newUser = { InEdit: true } as User;
    this.backupUser = Object.assign({}, newUser);
    this.searchResponse?.results.push(newUser);
  }

  protected UneditUser(s: User){
    if (s.InEdit) {
      Object.assign(s, this.backupUser!);
    }

    if (!s.id) {
      this.searchResponse?.results.splice(-1, 1);
    }

    s.InEdit = false;
  }

  EditUser(product: User, editable: boolean) {

    this.searchResponse?.results.map(s => this.UneditUser(s));

    if (editable) {
      this.backupUser = Object.assign({}, product);
    } else {
      this.backupUser = undefined;
    }

    product.InEdit = editable;
  }

  SaveUser(product: User) {
    this.usersService.save(product, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(() => {
        this.searchUsers();
      })
  }

  DeleteUser(product: User) {
    if (confirm('Confirmați ștergerea?')) {
      this.usersService.delete(product, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
        .subscribe(() => {
          this.searchUsers();
        });
    }
  }
  //#endregion
}
