import {Injectable, OnInit} from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';

import { ReplaySubject } from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, NavigationExtras, NavigationStart, Router, UrlSegment} from "@angular/router";
import {Logger} from "./logger.service";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public url$: ReplaySubject<string>;
  private _url: string;
  public get url() { return this._url; };
  // service worker is not present now.
  swUpdateActivated = false;
  private readonly urlParser = document.createElement('a');

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private logger: Logger
    /* swUpdates: SwUpdatesService */) {
    this.url$ = new ReplaySubject<string>(1);
    this.url$.subscribe(url => this._url = url);
    this.url$.next(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => this.url$.next((event as NavigationEnd).urlAfterRedirects));
    // swUpdates.updateActivated.subscribe(() => this.swUpdateActivated = true);
  }

  go(commands: any[], extras?: NavigationExtras) {
    this.router.navigate(commands, extras).then();
  }

  // Original TO_DO ignore if url-without-hash-or-search matches current location?
  goUrl(url: string|null|undefined) {
    if (!url) { return; }
    url = LocationService.stripSlashes(url);
    if (/^http/.test(url)) {
      // Has http protocol so leave the site
      this.goExternal(url);
    } else if (this.swUpdateActivated) {
      // (Do a "full page navigation" if a ServiceWorker update has been activated)
      this.goExternal(url);
    } else {
      this.router.navigateByUrl(url).then();
    }
  }

  goExternal(url: string) {
    window.location.assign(url);
  }

  replace(url: string) {
    window.location.replace(url);
  }

  private static stripSlashes(url: string) {
    return url.replace(/^\/+/, '').replace(/\/+(\?|#|$)/, '$1');
  }

  /**
   * Handle user's anchor click
   *
   * @param anchor {HTMLAnchorElement} - the anchor element clicked
   * @param button Number of the mouse button held down. 0 means left or none
   * @param ctrlKey True if control key held down
   * @param metaKey True if command or window key held down
   * @return false if service navigated with `go()`; true if browser should handle it.
   *
   * This is used to handle link in non-static content (UGC)
   */

  handleAnchorClick(anchor: HTMLAnchorElement, button = 0, ctrlKey = false, metaKey = false) {

    // Check for modifier keys and non-left-button, which indicate the user wants to control navigation
    if (button !== 0 || ctrlKey || metaKey) {
      return true;
    }

    // If there is a target and it is not `_self` then we take this
    // as a signal that it doesn't want to be intercepted.
    // Original TO_DO: should we also allow an explicit `_self` target to opt-out?
    const anchorTarget = anchor.target;
    if (anchorTarget && anchorTarget !== '_self') {
      return true;
    }

    if (anchor.getAttribute('download') != null) {
      return true; // let the download happen
    }

    const { pathname, search, hash } = anchor;
    const relativeUrl = pathname + search + hash;
    this.urlParser.href = relativeUrl;

    // don't navigate if external link or has extension
    if ( anchor.href !== this.urlParser.href ||
      !/\/[^/.]*$/.test(pathname) ) {
      return true;
    }

    // approved for navigation
    this.goUrl(relativeUrl);
    return false;
  }
}
