import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.styl']
})
export class UsercenterComponent implements OnInit {

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