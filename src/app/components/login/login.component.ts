import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth.service';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../BaseComponent';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  year: number = 0;
  password: string = '';
  username: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { super(); }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  public DoLogin(f: NgForm) {

    if (!this.validateForm(f)) {
      return;
    }

    this.authService
      .login(this.username, this.password, () => this.setLoading(true), () => this.setLoading(false), error => this.errorHandler(error))
      .subscribe(response => {
        this.setLoading(false);
        this.authService.setToken(response.token);
        this.router.navigate([environment.DashboardRoute]);
      })
  }
}
