import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl']
})
export class RegisterComponent implements OnInit {

  passwordConfirm = (control: FormGroup): ValidationErrors | null => {
    const password = control.value.password;
    const passwordConfirm = control.value.passwordConfirm;
    console.log(`checked with ${password} ${passwordConfirm}`)
    return password && passwordConfirm && password === passwordConfirm ? null : {passwordMismatch: true};
  }

  passwordErrorStateMatcher = new RepeatedErrorStateMatcher();

  registerForm = new FormGroup({
    code: new FormControl(''),
    email: new FormControl('', [
      Validators.email
    ]),
    id: new FormControl(''),
    name: new FormControl(''),
    password: new FormControl('', [
      Validators.minLength(8)
    ]),
    passwordConfirm: new FormControl('')
  }, [
    this.passwordConfirm
  ])

  // TODO send register request
  register() {

  }

  constructor() { }

  ngOnInit(): void {
    for (const [, control] of Object.entries(this.registerForm.controls)) {
      control.setValue('');
    }
  }

}

export class RepeatedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control.value && form.hasError('passwordMismatch'));
  }
}
