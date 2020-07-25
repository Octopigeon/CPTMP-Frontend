import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {PostRegisterQ, RoleTable, UserInfo} from "../../types/types";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../services/message.service";
import {ConnectionService} from "../../services/connection.service";

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

  postRegisterQ1: PostRegisterQ[];

  postRegisterQ2: PostRegisterQ[];

  postRegisterQ3: PostRegisterQ[];

  postRegisterQ4: PostRegisterQ[];

  inputBox: boolean[];

  /***
   * 读取用户传入的vcs文件
   */
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
      this.postRegisterQ1 = [];
      this.postRegisterQ2 = [];
      this.postRegisterQ3 = [];
      this.postRegisterQ4 = [];
      for (let i = 0; i < dates.length; i++){
        const user: UserInfo = {
          avatar: "",
          email: dates[i][2],
          gender: (dates[i][3] === '男') ? true : false,
          name: dates[i][1],
          phone_number: dates[i][4],
          role_name: dates[i][5],
          user_id: i + 1,
          username: dates[i][7] + '-' + dates[i][0]
        };
        let regQ: PostRegisterQ = {
          common_id: dates[i][0],
          name: dates[i][1],
          password: '123',
          email: dates[i][2],
          organization_id: dates[i][6]
        };
        this.dataSource.data.push(user);
        if (dates[i][5] === 'ROLE_ENTERPRISE_ADMIN'){
          this.postRegisterQ1.push(regQ);
        }else if (dates[i][5] === 'ROLE_SCHOOL_ADMIN'){
          this.postRegisterQ2.push(regQ);
        }else if (dates[i][5] === 'ROLE_SCHOOL_TEACHER'){
          this.postRegisterQ3.push(regQ);
        }else if (dates[i][5] === 'ROLE_STUDENT_MEMBER'){
          this.postRegisterQ4.push(regQ);
        }

      }
      console.log(this.postRegisterQ1);
      this.msg.SendMessage('导入信息成功').subscribe()
      this.dataSource.paginator = this.paginator;
    });
  }

  /***
   * 对用户传入为vcs文件进行分词，格式化数据
   * @param csvString
   */
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
    console.log(datas)
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
    this.PostEnterpriseAdminReg();
    this.PostStudentReg();
    this.PostTeacherAdminReg();
    this.PostTeacherReg();
    this.dialogRef.close(this.inputBox);
  }

  constructor(public dialogRef: MatDialogRef<AccountBulkAddComponent>,
              public msg: MessageService,
              private conn: ConnectionService,) { }

  ngOnInit(): void {
    this.inputBox = [];
  }

  public PostEnterpriseAdminReg(){
    this.conn.PostEnterpriseAdminReg(this.postRegisterQ1).subscribe({
      next: resp => {
        this.inputBox.push(true);
      },
      error: () => {
        this.inputBox.push(false);
      }
    })
  }

  public PostTeacherAdminReg(){
    this.conn.PostTeacherAdminReg(this.postRegisterQ2).subscribe({
      next: resp => {
        this.inputBox.push(true);
      },
      error: () => {
        this.inputBox.push(false);
      }
    });
  }


  public PostTeacherReg(){
    this.conn.PostTeacherReg(this.postRegisterQ3).subscribe({
      next: resp => {
        this.inputBox.push(true);
      },
      error: () => {
        this.inputBox.push(false);
      }
    });
  }


  public PostStudentReg(){
    this.conn.PostStudentReg(this.postRegisterQ4).subscribe({
      next: resp => {
        this.inputBox.push(true);
      },
      error: () => {
        this.inputBox.push(false);
      }
    });
  }


}
