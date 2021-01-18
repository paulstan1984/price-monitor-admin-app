import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/AuthService.service';
import { environment } from 'src/environments/environment';
import { LoggedInComponent } from '../LoggedInComponent';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoggedInComponent implements OnInit {

  constructor(
    authService: AuthServiceService,
    router: Router
  ) {
    super(authService, router);
  }

  DoLogout(){
    this.authService.logout();
    this.router.navigate([environment.LoginRoute])
  }
}
