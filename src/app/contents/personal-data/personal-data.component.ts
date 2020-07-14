import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators} from "@angular/forms";
import {ConnectionService} from "../../services/connection.service";
import {LocationService} from "../../services/location.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {ChangePasswordQ, ModifyUserBasicInfoQ} from "../../types/types";
import {MessageService} from "../../services/message.service";
import {MatDialog} from "@angular/material/dialog";
import {ChangeAvatarComponent} from "../../popups/change-avatar/change-avatar.component";
import {Logger} from "../../services/logger.service";
import {Observable} from "rxjs";

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

  constructor(public conn: ConnectionService,
              private loc: LocationService,
              private msg: MessageService,
              public dialog: MatDialog,
              private logger: Logger) { }

  basicDataForm = new FormGroup({
    realName: new FormControl(''),
    gender: new FormControl(false),
    introduction: new FormControl(''),
  });

  passwordConfirm = (control: FormGroup): ValidationErrors | null => {
    const password = control.value.passwordNew;
    const passwordConfirm = control.value.passwordConfirm;
    this.logger.log(`checked with ${password} ${passwordConfirm}`)
    return password && passwordConfirm && password === passwordConfirm ? null : {passwordMismatch: true};
  }

  passwordErrorStateMatcher = new RepeatedErrorStateMatcher();

  passwordChangeForm = new FormGroup({
    passwordCurrent: new FormControl(''),
    passwordNew: new FormControl('', [
      Validators.minLength(8)
    ]),
    passwordConfirm: new FormControl('')
  }, [
    this.passwordConfirm
  ])

  submitBasicDataForm(directive: FormGroupDirective) {
    // TODO save changes to basic user data



    this.msg.SendMessage('正在修改公开信息').subscribe()



    const req: ModifyUserBasicInfoQ = {
      name: this.basicDataForm.value.realName,
      gender: this.basicDataForm.value.gender,
      introduction: this.basicDataForm.value.introduction
    }
    this.conn.UploadUserBasicData(req).subscribe({
      next: resp => {
        this.msg.SendMessage('公开信息修改成功').subscribe()
        this.conn.GetUserInfo().subscribe()
      },
      error: () => {
        this.msg.SendMessage('公开信息修改失败。未知错误').subscribe()
        this.conn.GetUserInfo().subscribe()
      }
    })


    this.basicDataForm.reset()
    directive.resetForm()
  }

  submitPasswordChangeForm(directive: FormGroupDirective) {
    this.msg.SendMessage('正在修改密码').subscribe()

    const req: ChangePasswordQ = {
      origin_password: this.passwordChangeForm.value.passwordCurrent,
      new_password: this.passwordChangeForm.value.passwordNew
    }

    this.conn.ChangePassword(req).subscribe({
      next: resp => {
        if (resp.status === 0) {
          this.msg.SendMessage('密码修改成功').subscribe()
        } else {
          this.msg.SendMessage('密码修改失败。当前密码错误').subscribe()
        }
        this.conn.GetUserInfo().subscribe()
      },
      error: () => {
        this.msg.SendMessage('密码修改失败。未知错误').subscribe()
        this.conn.GetUserInfo().subscribe()
      }
    })

    this.passwordChangeForm.reset()
    directive.resetForm()
  }

  changeAvatar() {
    const dialogRef = this.dialog.open(ChangeAvatarComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.logger.log('The dialog was closed');
      if (result) {
        const observable = result as Observable<Blob>;
        this.conn.UploadAvatar(observable).subscribe({
          next: result => {
            this.logger.log(result)
            this.msg.SendMessage('头像上传成功').subscribe()
          },
          error: error => {
            this.logger.log(error)
            this.msg.SendMessage('头像上传失败').subscribe()
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.conn.user.subscribe(user => {
      this.basicDataForm.controls.realName.setValue(user.info.name);
      this.basicDataForm.controls.gender.setValue(
        user.info.gender === null ? 'null' : user.info.gender ? 'true' : 'false');
      this.basicDataForm.controls.introduction.setValue(user.info.introduction);
    })
  }
}

// We need this to make password repeat field marked as invalid immediately after input
// when value is different from password field.
export class RepeatedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control.value && form.hasError('passwordMismatch'));
  }
}
