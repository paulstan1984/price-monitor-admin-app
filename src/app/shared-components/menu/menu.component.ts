import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  expanded: boolean | undefined;
  
  constructor() {
  }

  ngOnInit() {
  }

}
