import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {RoleTable, UserInfo} from "../../types/types";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-account-bulk-add',
  templateUrl: './account-bulk-add.component.html',
  styleUrls: ['./account-bulk-add.component.styl']
})
export class AccountBulkAddComponent implements OnInit {

  @ViewChild('filePicker', {static: true}) filePicker: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  // change to true when data properly processed
  dataSource = new MatTableDataSource<UserInfo>();

  fileChangeEvent() {
    const filePicker = this.filePicker.nativeElement;
    if (!filePicker || !filePicker.files || filePicker.files.length === 0) {
      return;
    }

    const file = filePicker.files[0];
    new Observable<string>(observer => {
      const reader  = new FileReader();
      reader.onload = () => observer.next(reader.result as string);
      reader.readAsText(file);
    }).subscribe(content => {
      // TODO process csv into js data
      console.log(content);
      this.dataSource.data = [{
        avatar: "",
        email: `user1@mail.com`,
        gender: true,
        name: `user1`,
        phone_number: `123451`,
        role_name: 'ROLE_ENTERPRISE_ADMIN',
        user_id: 1,
        username: `TEST0001`
      }];
      this.dataSource.paginator = this.paginator;
    })
  }

  columns: {[key: string]: string} = {
    username: '账户名称',
    name: '姓名',
    email: '电子邮件',
    role_name: '角色',
    gender: '性别',
    phone_number: '电话号码',
  }

  get RoleTable() {
    return RoleTable;
  }

  get columnRefs() { return Object.keys(this.columns) }
  get columnPairs() { return Object.entries(this.columns) }

  cancelClose() {
    this.dialogRef.close();
  }

  // TODO return import result
  getResult() {

  }

  constructor(public dialogRef: MatDialogRef<AccountBulkAddComponent>) { }

  ngOnInit(): void {
  }

}
