import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Organization} from "../../types/types";

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.styl']
})
export class AccountEditComponent implements OnInit {

  isEditing: boolean = false;

  // TODO change to real fields
  accountForm = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
  })

  cancelClose() {
    this.dialogRef.close();
  }

  // TODO return user info from form
  getAccount() {

  }

  constructor(public dialogRef: MatDialogRef<AccountEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: Organization) {
    this.isEditing = data !== null;
    // TODO init form according to data (note: field might varies depends on user type)
  }

  ngOnInit(): void {
  }

}
