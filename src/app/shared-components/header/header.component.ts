import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }


  DoLogout() {
    this.authService
      .logout()
      .subscribe(_ => {
        localStorage.removeItem(environment.PriceMonitorToken);
        this.router.navigate([environment.LoginRoute])
      });
  }

  private menuExpanded = false;

  toggleMenu() {
    this.menuExpanded = !this.menuExpanded;
    if (this.menuExpanded) {
      window.scroll(0, 0);
    }
    this.onMenuExpanded?.emit(this.menuExpanded);
  }

  @Output()
  onMenuExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();
}
