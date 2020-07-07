import { Component } from '@angular/core';
import {EnvService} from "../services/env.service";

@Component({
  selector: 'cptmp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'CPTMP';
  isFetching = false;
  isTransitioning = false;

  windowType = this.env.size$;

  constructor(private env: EnvService) {

  }

}
