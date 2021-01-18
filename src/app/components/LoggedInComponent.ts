import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthServiceService } from "../services/AuthService.service";
import { BaseComponent } from "./BaseComponent";

@Injectable()
export class LoggedInComponent extends BaseComponent implements OnInit {

    constructor(
        protected authService: AuthServiceService,
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