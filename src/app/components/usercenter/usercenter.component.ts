import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.styl']
})
export class UsercenterComponent implements OnInit {

  constructor() { }

  isUserInfoPage = false;

  isChangeAvatarPage = false;

  itemTitle = '丨首页';

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

  public jumpToInfoPage(): void{
    this.isUserInfoPage = true;
    this.isChangeAvatarPage = false;
    this.itemTitle = '丨我的信息';
  }

  public jumpToAvatarPage(): void{
    this.isUserInfoPage = false;
    this.isChangeAvatarPage = true;
    this.itemTitle = '丨我的头像';
  }

}
