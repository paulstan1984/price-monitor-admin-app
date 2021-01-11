import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../BaseComponent';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  year: number = 0;

  constructor() { super(); }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

}
