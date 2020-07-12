import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Logger {

  constructor(private errorHandler: ErrorHandler) {}

  log(value: any, ...rest: any[]) {
    // debug logs. Output only at dev mode
    if (!environment.production) {
      console.log(value, ...rest);
    }
  }

  error(error: Error) {
    this.errorHandler.handleError(error);
  }

  warn(value: any, ...rest: any[]) {
    console.warn(value, ...rest);
  }
}
