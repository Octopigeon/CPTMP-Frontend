import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ConnectionService} from "../../services/connection.service";
import {LocationService} from "../../services/location.service";

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

  constructor(private conn: ConnectionService, private loc: LocationService) { }

  basicDataForm = new FormGroup({
    realName: new FormControl(''),
    male: new FormControl(false),
    introduction: new FormControl(''),
  });

  ngOnInit(): void {
    this.fillForm();
  }

  private fillForm() {
    this.conn.loadInfo().subscribe(result => {
      if (result) {
        this.basicDataForm.controls.realName.setValue(this.conn.user.info.name);
        this.basicDataForm.controls.male.setValue(
          this.conn.user.info.male === null ? 'null' :
            this.conn.user.info.male ? 'true' : 'false');
        this.basicDataForm.controls.introduction.setValue(this.conn.user.info.introduction);
      } else {
        this.loc.go(['/'])
      }
    })
  }
}
