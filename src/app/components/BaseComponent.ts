import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";

export interface ErrorObject{ 
  GlobalMessage: string;
  DetailedMessages: Map<string, string>;
}

@Injectable()
export class BaseComponent {

  loading: boolean = false;
  errorObj: ErrorObject = {
    GlobalMessage: '',
    DetailedMessages : new Map<string, string>()
  } as ErrorObject;

  errorHandler(error: HttpErrorResponse) {
    switch (error.status) {

      case 400:
        break;

      case 404:
        break;

      case 500:
      default:
        console.log(error.message);
        this.errorObj.GlobalMessage = error.message;
        break;
    }
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

  setLoading(loading: boolean) {
    this.loading = loading;
  }
}