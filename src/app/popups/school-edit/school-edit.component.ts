import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Organization, UserInfo, } from "../../types/types";
import {observable, Observable, Subscriber} from "rxjs";

@Component({
  selector: 'app-school-edit',
  templateUrl: './school-edit.component.html',
  styleUrls: ['./school-edit.component.styl']
})
export class SchoolEditComponent implements OnInit {

  isEditing: boolean;

  schoolForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    // TODO (optional) pre-verify local cache of school list to prevent duplicate code request being sent
    code: new FormControl('', [
      Validators.required
    ]),
    url: new FormControl('', [
      Validators.pattern(/https?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/gi)
    ]),
    description: new FormControl('暂无简介')
  })

  cancelClose() {
    this.dialogRef.close();
  }

  // FinishTodo return school info from form
  getSchool(){
    const org: Organization = {
      name: this.schoolForm.value.name,
      code: this.schoolForm.value.code,
      url: this.schoolForm.value.url,
      description: this.schoolForm.value.description
    };
    this.dialogRef.close(org);
  }

  constructor(public dialogRef: MatDialogRef<SchoolEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Organization) {
    this.isEditing = data !== null;

    // FinishTodo init form according to data
    if (this.isEditing){
      this.schoolForm.setValue({
        name: data.name,
        code: data.code,
        url: data.url,
        description: data.description
      })
    }
  }

  ngOnInit(): void {
  }

}
