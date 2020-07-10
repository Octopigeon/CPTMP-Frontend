import { Component, OnInit } from '@angular/core';

/** This component will finish following operations:
 * Check personal info
 * Change personal info (safe infos that can be simply changed upon request)
 * Change password
 */

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.styl']
})
export class PersonalDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
