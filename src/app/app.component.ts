import {Component, OnInit} from '@angular/core';
import {EnvService} from "./services/env.service";
import {AdminNodes} from "./constants/sidebar";
import {LocationService} from "./services/location.service";
import {map, shareReplay, tap} from "rxjs/operators";
import {Logger} from "./services/logger.service";
import {ConnectionService} from "./services/connection.service";
import {NavigationService} from "./services/navigation.service";
import {NavigationNode} from "./types/nav.model";
import {of, ReplaySubject, Subject} from "rxjs";

@Component({
  selector: 'cptmp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'CPTMP';
  isFetching = false;

  // start page has different style and elements
  isStartPage = this.loc.url$.pipe(
    tap(path => this.logger.log('got path ' + path)),
    map(path => !path.startsWith('/plat')),
  );

  windowType = this.env.size$;
  sideNavNodes$ = new ReplaySubject<NavigationNode[]>(1);

  messageCount$ = of(3).pipe(shareReplay(1));

  constructor(private env: EnvService,
              private loc: LocationService,
              private logger: Logger,
              public conn: ConnectionService,
              public nav: NavigationService) {

  }

  ngOnInit(): void {
    this.sideNavNodes$.subscribe(nodes => this.nav.updateNavigationView(nodes))
    // TODO change according to user type
    this.sideNavNodes$.next(AdminNodes);
  }

}
