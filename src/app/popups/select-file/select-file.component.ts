import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.styl']
})
export class SelectFileComponent implements OnInit {

  @ViewChild('filePicker', {static: true}) filePicker: ElementRef<HTMLInputElement>;

  files: File[] = [];

  data = {
    title: '上传文件',
    buttonHint: '选择文件',
    multiple: false
  }

  fileChangeEvent() {
    this.files = [];
    const filePicker = this.filePicker.nativeElement;
    if (!filePicker || !filePicker.files || filePicker.files.length === 0) {
      return;
    }

    for (let i = 0; i < filePicker.files.length; i++) {
      this.files.push(filePicker.files[i]);
    }
  }

  constructor(public dialogRef: MatDialogRef<SelectFileComponent>,
              @Inject(MAT_DIALOG_DATA) public _data?: Object) {
    Object.entries(_data).forEach(([k, v]) => this.data[k] = v)
  }

  cancelClose() {
    this.dialogRef.close();
  }

  getResult() {
    return this.files;
  }

  ngOnInit(): void {
  }

}
