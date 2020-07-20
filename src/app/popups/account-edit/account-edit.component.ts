import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Organization, PostRegisterQ, UserInfo} from "../../types/types";

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.styl']
})
export class AccountEditComponent implements OnInit {

  isEditing: boolean = false;

  gender: string;

  // TODO change to real fields
  accountForm = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    common_id: new FormControl(''),
  })

  cancelClose() {
    this.dialogRef.close();
  }

  /***
   * 返回该视窗修改后的用户对象
   */
  // TODO return user info from form
  getAccount() {
    if ( !this.isEditing ){
      let regQ: PostRegisterQ = {
        common_id: this.accountForm.controls.common_id.value,
        name: this.accountForm.controls.name.value,
        password: '123',
        email: this.accountForm.controls.email.value,
        organization_id: 1
      };
      this.dialogRef.close(regQ);
    }
  }

  /***
   * 根据传入数据进行初始化
   * @param dialogRef
   * @param data
   */
  constructor(public dialogRef: MatDialogRef<AccountEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: UserInfo) {
    this.isEditing = data !== null;
    // TODO init form according to data (note: field might varies depends on user type)
    if (data !== null){
      this.accountForm.controls.name.setValue(data.name);
      this.accountForm.controls.phone.setValue(data.phone_number);
      this.gender = (data.gender === null) ? '3' : (data.gender === true) ? '1' : '2';
      console.log(this.gender)
    }
  }

  ngOnInit(): void {
  }

}
