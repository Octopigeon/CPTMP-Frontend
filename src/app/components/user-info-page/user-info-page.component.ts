import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.styl']
})
export class UserInfoPageComponent implements OnInit {

  constructor() { }

  userinfo: any = {
    id : 0,
    username: '',
    nickname: '',
    introduction: '',
    email: '',
    phone_number: '',
    gender: '',
    role_name: ''
  };

  ngOnInit(): void {
  }


}
