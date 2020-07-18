import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {PostRegisterQ, RoleTable, UserInfo} from "../../types/types";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-account-bulk-add',
  templateUrl: './account-bulk-add.component.html',
  styleUrls: ['./account-bulk-add.component.styl']
})
export class AccountBulkAddComponent implements OnInit {

  @ViewChild('filePicker', {static: true}) filePicker: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  // change to true when data properly processed
  dataSource = new MatTableDataSource<UserInfo>([]);

  postRegisterQ: PostRegisterQ[] = [];

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
      // FinishTodo process csv into js data (maybe reusable) (should we support excel format?)
      const dates: any[] = this.csvToObject(content);
      for (let i = 0; i < dates.length; i++){
        const user: UserInfo = {
          avatar: "",
          email: dates[i][2],
          gender: (dates[i][3] == '男') ? true : false,
          name: dates[i][1],
          phone_number: dates[i][4],
          role_name: 'ROLE_ENTERPRISE_ADMIN',
          user_id: i + 1,
          username: 'E-' + dates[i][0]
        };
        let regQ: PostRegisterQ = {
          common_id: dates[i][0],
          name: dates[i][1],
          password: '123',
          email: dates[i][2],
          organization_id: 1
        };
        this.dataSource.data.push(user);
        this.postRegisterQ.push(regQ);
      }
      this.msg.SendMessage('导入信息成功').subscribe()
      this.dataSource.paginator = this.paginator;
    });
  }

  csvToObject(csvString): any[]{
    const csvarry = csvString.split('\r\n');
    const datas: any[] = [];
    const headers = csvarry[0].split(',');
    for (let i = 1; i < csvarry.length - 1; i++){
      const data = {};
      const temp = csvarry[i].split(',');
      for (let j = 0; j < temp.length; j++){
        data[j] = temp[j];
      }
      datas.push(data);
    }
    return datas;
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

  // FinishTodo return import result
  getResult() {
      this.dialogRef.close(this.postRegisterQ);
  }

  constructor(public dialogRef: MatDialogRef<AccountBulkAddComponent>,
              public msg: MessageService) { }

  ngOnInit(): void {
  }

}
