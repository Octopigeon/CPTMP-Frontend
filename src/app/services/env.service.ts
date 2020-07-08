import {Inject, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, ReplaySubject, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, map, takeUntil, tap} from "rxjs/operators";
import {Logger} from "./logger.service";
import {WINDOW} from "./window";

export type Size = "desktop" | "phone" | "laptop";

@Injectable({
  providedIn: 'root'
})
export class EnvService implements OnDestroy {

  public size$ = new ReplaySubject<Size>(1);
  private onDestroy = new Subject<void>();

  private getSize(): Size {
    if (this.window.innerWidth >= 1024) {
      return "desktop";
    } else if (this.window.innerWidth < 600) {
      return "phone";
    } else {
      return "laptop";
    }
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private logger: Logger) {
    this.size$.next(this.getSize());

    fromEvent(window, 'resize').pipe(
      takeUntil(this.onDestroy),
      map(_ => this.getSize()),
      debounceTime(500),
      distinctUntilChanged(),
      tap(size => this.logger.log(`Viewport resized into ${size} range.`))
    ).subscribe(size => this.size$.next(size));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
