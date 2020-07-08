import { AfterViewInit, Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {LocationService} from "../../services/location.service";

/**
 * This component provides a text box to type a search query that will be sent to the SearchService.
 *
 * When you arrive at a page containing this component, it will retrieve the `query` from the browser
 * address bar. If there is a query then this will be made.
 *
 * Focussing on the input box will resend whatever query is there. This can be useful if the search
 * results had been hidden for some reason.
 *
 */
@Component({
  selector: 'search-box',
  template: `<input #searchBox
    type="search"
    aria-label="search"
    placeholder="Search"
    (input)="doSearch()"
    (keyup)="doSearch()"
    (focus)="doFocus()"
    (click)="doSearch()">`,
  styleUrls: ['./search-box.component.styl']
})
export class SearchBoxComponent implements AfterViewInit {

  private searchDebounce = 300;
  private search$ = new Subject<string>();

  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSearch = this.search$.pipe(distinctUntilChanged(), debounceTime(this.searchDebounce));
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFocus = new EventEmitter<string>();

  constructor(private locationService: LocationService) { }

  /**
   * When we first show this search box we trigger a search if there is a search query in the URL
   */
  ngAfterViewInit() {
    const query = this.locationService.search()['search'];
    if (query) {
      this.query = SearchBoxComponent.decodeQuery(query);
      this.doSearch();
    }
  }

  doSearch() {
    this.search$.next(this.query);
  }

  doFocus() {
    this.onFocus.emit(this.query);
  }

  focus() {
    this.searchBox.nativeElement.focus();
  }

  private static decodeQuery(query: string): string {
    // `decodeURIComponent` does not handle `+` for spaces, replace via RexEx.
    return query.replace(/\+/g, ' ');
  }

  private get query() { return this.searchBox.nativeElement.value; }
  private set query(value: string) { this.searchBox.nativeElement.value = value; }
}
