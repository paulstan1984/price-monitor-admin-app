import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class BaseComponent {

    errorHandler(error: HttpErrorResponse) {
        console.error(error);
        throw error;
    }
}