import { Injectable } from '@angular/core';
import {JsLoaderService} from "../../services/js-loader.service";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationPickerResolverService implements Resolve<boolean> {

  constructor(private loader: JsLoaderService) { }

  resolve(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(subscriber => {
      this.loader.load('google_map').subscribe({
        next: () => {
          subscriber.next(true);
          subscriber.complete()
        },
        error: () => {
          subscriber.next(false);
          subscriber.complete()
        },
      })
    })
  }
}
