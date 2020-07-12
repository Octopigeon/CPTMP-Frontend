import { Component, OnInit } from '@angular/core';
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.styl']
})
export class NotFoundComponent implements OnInit {

  constructor(private loc: LocationService) {
  }

  ngOnInit(): void {
    this.loc.route.paramMap.subscribe(_ => {
      if (!this.loc.url.startsWith('/not-found')) {
        this.loc.go(['/', 'not-found'])
      }
    })
  }

}
