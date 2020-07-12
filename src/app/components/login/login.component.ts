import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective} from "@angular/forms";
import {LoginQ} from "../../types/types";
import {ConnectionService} from "../../services/connection.service";
import {Logger} from "../../services/logger.service";
import {ErrorCode} from "../../constants/error-code";
import {EnvService} from "../../services/env.service";
import {LocationService} from "../../services/location.service";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl'],
})
export class LoginComponent implements OnInit {

  constructor(private conn: ConnectionService,
              private logger: Logger,
              private msg: MessageService,
              private env: EnvService,
              private loc: LocationService) { }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  errorInfo: string = '';
  previousDirty: boolean = false;

  public login(directive: FormGroupDirective) {
    this.msg.SendMessage(`正在登录，请稍候...`).subscribe();
    const req: LoginQ = {
      password: this.loginForm.value.password,
      username: this.loginForm.value.username
    }

    this.conn.Login(req).subscribe({
      next: info => {
        this.logger.log("Login successful as " + info)
        this.loc.go(['plat', 'user', 'me'])
        this.msg.SendMessage(`登录成功。欢迎回来，${info.name}`).subscribe();
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
