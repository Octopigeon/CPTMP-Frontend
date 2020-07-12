import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {EnvService} from "./env.service";
import {first} from "rxjs/operators";
import {MatSnackBarConfig} from "@angular/material/snack-bar/snack-bar-config";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private env: EnvService, private snackBar: MatSnackBar) {}

  public SendMessage(message: string, action?: string): Observable<MatSnackBarRef<SimpleSnackBar>> {
    return new Observable(observer => {
      this.env.size$.pipe(
        first()
      ).subscribe(size => {
        const config: MatSnackBarConfig = {
          duration: 5000,
          horizontalPosition: size === 'phone' ? 'center' : 'right',
          verticalPosition: size === 'phone' ? 'bottom' : 'top'
        }
        observer.next(this.snackBar.open(message, action, config));
      })
    })
  }
}
