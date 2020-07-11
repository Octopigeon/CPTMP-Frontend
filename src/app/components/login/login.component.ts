import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective} from "@angular/forms";
import {LoginQ} from "../../types/types";
import {ConnectionService} from "../../services/connection.service";
import {Logger} from "../../services/logger.service";
import {ErrorCode} from "../../constants/error-code";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EnvService} from "../../services/env.service";
import {first} from "rxjs/operators";
import {MatSnackBarConfig} from "@angular/material/snack-bar/snack-bar-config";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl'],
})
export class LoginComponent implements OnInit {

  constructor(private conn: ConnectionService,
              private logger: Logger,
              public snackBar: MatSnackBar,
              private env: EnvService,
              private loc: LocationService) { }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  errorInfo: string = '';
  previousDirty: boolean = false;

  public login(directive: FormGroupDirective) {
    const req: LoginQ = {
      password: this.loginForm.value.password,
      username: this.loginForm.value.username
    }

    this.conn.Login(req).subscribe({
      next: info => {
        this.logger.log("Login successful as " + info)
        this.loc.go(['plat', 'user', 'me'])
        this.env.size$.pipe(
          first()
        ).subscribe(size => {
          const config: MatSnackBarConfig = {
            duration: 5000,
            horizontalPosition: size === 'phone' ? 'center' : 'right',
            verticalPosition: size === 'phone' ? 'bottom' : 'top'
          }
          this.snackBar.open(`${info.name}，欢迎使用本系统。`, null, config);
        })
      },
      error: err => {
        this.logger.log("Login failed: " + err)
        this.errorInfo = "登录失败：" + (err.msg && err.status ? ErrorCode[err.status] : "未知错误");
      }
    })

    this.loginForm.reset();
    directive.resetForm();
  }

  ngOnInit(): void {
    this.loginForm.reset();
    this.loginForm.valueChanges.subscribe(_ => {
      if (!this.previousDirty && this.loginForm.dirty) {
        this.errorInfo = '';
      }
      this.previousDirty = this.loginForm.dirty;
    })
  }

}
