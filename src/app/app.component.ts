import { Component } from '@angular/core';
import {EnvService} from "./services/env.service";
import {AdminNodes} from "./constants/sidebar";
import {LocationService} from "./services/location.service";
import {map, tap} from "rxjs/operators";
import {Logger} from "./services/logger.service";
import {ConnectionService} from "./services/connection.service";

@Component({
  selector: 'cptmp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'CPTMP';
  isFetching = false;
  isTransitioning = false;
  isStartPage = this.loc.url$.pipe(
    tap(path => this.logger.log('got path ' + path)),
    map(path => !path.startsWith('/plat')),
  );

  windowType = this.env.size$;

  sidenavNodes = AdminNodes;

  constructor(private env: EnvService,
              private loc: LocationService,
              private logger: Logger,
              public conn: ConnectionService) {

  }

}
