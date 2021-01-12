import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/AuthService.service';
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

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { super(); }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  public DoLogin(f: NgForm){

    if(!this.validateForm(f)){
      return;
    }

    this.authService
    .login(this.password, this.errorHandler)
    .subscribe(response => {
      this.authService.setToken(response.token);
      this.router.navigate([environment.DashboardRoute]);
    })
  }
}
