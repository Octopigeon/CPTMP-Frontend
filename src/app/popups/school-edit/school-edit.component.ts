import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Organization} from "../../types/types";

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

  // TODO return school info from form
  getSchool() {

  }

  constructor(public dialogRef: MatDialogRef<SchoolEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: Organization) {
    this.isEditing = data !== null;
    // TODO init form according to data
    this.schoolForm.value.declarations = data.description;
  }

  ngOnInit(): void {
  }

}
