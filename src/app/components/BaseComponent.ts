import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";


@Injectable()
export class BaseComponent {

    errorHandler(error: HttpErrorResponse) {
        console.error(error);
        throw error;
    }

    public validateForm(f: NgForm): boolean {
        let valid = true;
    
        for (const key in f.controls) {
          if (f.controls.hasOwnProperty(key)) {
            valid = valid && f.controls[key].valid;
          }
        }

        return valid;
    };
}