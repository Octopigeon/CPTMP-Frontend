import { Component } from '@angular/core';
import {EnvService} from "./services/env.service";
import {AdminNodes} from "./constants/sidebar";

@Component({
  selector: 'cptmp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'CPTMP';
  isFetching = false;
  isTransitioning = false;
  isStartPage = false;

  windowType = this.env.size$;

  sidenavNodes = AdminNodes;

  constructor(private env: EnvService) {

  }

}
