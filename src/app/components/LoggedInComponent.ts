import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/Auth.service";
import { BaseComponent } from "./BaseComponent";

@Injectable()
export class LoggedInComponent extends BaseComponent implements OnInit {

    public menuExpanded : boolean | undefined;

    public onMenuExpanded(expanded: boolean) {
      this.menuExpanded = expanded;
    }

    constructor(
        protected authService: AuthService,
        protected router: Router
    ) {
        super();
    }
    
    ngOnInit(): void {
        this.authService.isLoggedIn(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
        });
    }
    
}