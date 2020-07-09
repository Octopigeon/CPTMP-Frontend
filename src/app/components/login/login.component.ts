import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  constructor() { }

  loginForm = new FormGroup({
    emailOrID: new FormControl(''),
    password: new FormControl('')
  })

  ngOnInit(): void {
    this.loginForm.controls.emailOrID.setValue('');
    this.loginForm.controls.password.setValue('');
  }

}
