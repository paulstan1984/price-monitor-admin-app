import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/AuthService.service';
import { BaseComponent } from '../BaseComponent';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  year: number = 0;
  public password: string = '123';

  constructor(private authService: AuthServiceService) { super(); }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  DoLogin(){
    this.authService.login(this.password, this.errorHandler);
  }
}
