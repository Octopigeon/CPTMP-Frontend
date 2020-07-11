import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-safe-page',
  templateUrl: './safe-page.component.html',
  styleUrls: ['./safe-page.component.styl']
})
export class SafePageComponent implements OnInit {

  constructor() { }

  isMainPage = true;

  isPasswordPage = false;

  isEmailPage = false;

  ngOnInit(): void {
  }


  jumpToChangePasswordPage(): void{
    this.isMainPage = false;
    this.isPasswordPage = true;
    this.isEmailPage = false;
  }

  jumpToChangeEmailPage(): void{
    this.isMainPage = false;
    this.isEmailPage = true;
    this.isPasswordPage = false;
  }

  backToMainPage(): void{
    this.isMainPage = true;
    this.isEmailPage = false;
    this.isPasswordPage = false;
  }
}
