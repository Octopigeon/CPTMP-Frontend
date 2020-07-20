import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-single-textarea',
  templateUrl: './single-textarea.component.html',
  styleUrls: ['./single-textarea.component.styl']
})
export class SingleTextareaComponent implements OnInit {

  inputControl = new FormControl('', [Validators.required]);

  data = {
    title: '请输入值',
    inputLabel: '值',
    inputPlaceholder: '',
  }

  constructor(public dialogRef: MatDialogRef<SingleTextareaComponent>,
              @Inject(MAT_DIALOG_DATA) public _data?: Object) {
    Object.entries(_data).forEach(([k, v]) => this.data[k] = v)
  }

  cancelClose() {
    this.dialogRef.close();
  }

  getResult() {
    return this.inputControl.value;
  }

  ngOnInit(): void {
  }

}
