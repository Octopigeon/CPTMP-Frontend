import { Component, OnInit } from '@angular/core';
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.styl']
})
export class AccountAdminComponent implements OnInit {

  typeString: {[key: string]: string} = {
    'enterprise': '企业',
    'teacher': '组织教师',
    'student': '组织学生'
  }

  type: string;

  constructor(private loc: LocationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!data || !data.type || !this.typeString[data.type]) {
        return;
      }
      this.type = data.type;
    })
  }
}


