import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";
import {Organization, UserInfo, RoleTable, DeleteUserQ, PageInfoQ, Resp, PostRegisterQ} from "../../types/types";
import {CollectionViewer, DataSource, ListRange, SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BehaviorSubject, Observable, of, Subscriber, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";
import {SchoolEditComponent} from "../../popups/school-edit/school-edit.component";
import {MatDialog} from "@angular/material/dialog";
import {AccountEditComponent} from "../../popups/account-edit/account-edit.component";
import {AccountBulkAddComponent} from "../../popups/account-bulk-add/account-bulk-add.component";
import {SingleInputComponent} from "../../popups/single-input/single-input.component";

@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.styl']
})
export class AccountAdminComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  typeString: {[key: string]: string} = {
    enterprise: '企业管理员',
    teacher: '组织教师',
    student: '学生'
  }

  type: string;
  dataSource: AccountDataSource;

  columns: {[key: string]: string} = {
    user_id: '#',
    username: '账户名称',
    name: '姓名',
    email: '电子邮件',
    role_name: '角色',
    gender: '性别',
    phone_number: '电话号码',
    avatar: '头像',
  }

  get RoleTable() {
    return RoleTable;
  }

  get columnRefs() {
    let keys = Object.keys(this.columns);
    keys.unshift('select');
    keys.push('edit');
    return keys
  }

  get columnPairs() { return Object.entries(this.columns) }
  selection = new SelectionModel<UserInfo>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.paginator.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // FinshTodo delete selected user
  userDelete() {

    this.msg.SendMessage('正在删除账号……').subscribe()
    const userList: number[] = [];
    for (const typeElement of this.selection.selected) {
      userList.push(typeElement.user_id);
    }
    console.log(userList);
    this.conn.DeleteUser(userList).subscribe({
      next: resp => {
        this.msg.SendMessage('删除账号成功').subscribe()
      },
      error: () => {
        this.msg.SendMessage('删除账号失败。未知错误').subscribe()
      },
      complete: () => {
        this.dataSource.getRange();
        console.log(123)
      }
    })
  }

  userEdit(event?: Event, user?: UserInfo) {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(AccountEditComponent, {
      data: user
    });

    // TODO get data & post create/modify request to backend
    dialogRef.afterClosed().subscribe(result => {
      if ( user == null ){
        if (result == null){
          this.msg.SendMessage('创建被取消').subscribe();
        }else{
          const regQ: PostRegisterQ = result as PostRegisterQ;
          const regQList: PostRegisterQ[] = [regQ];
          this.conn.PostEnterpriseAdminReg(regQList).subscribe({
            next: resp => {
              this.msg.SendMessage('创建账号成功').subscribe();
            },
            error: () => {
              this.msg.SendMessage('创建账号失败').subscribe();
            }
          })
        }
      }else{

      }
    })
  }

  userBulkAdd(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(AccountBulkAddComponent);

    // FinishTodo post data to backend
    dialogRef.afterClosed().subscribe(result => {
      if (result == null){
        this.msg.SendMessage('导入被取消').subscribe();
      }else{
        const regQ: PostRegisterQ[] = result as PostRegisterQ[];
        this.conn.PostEnterpriseAdminReg(regQ).subscribe({
          next: resp => {
            this.msg.SendMessage('导入账号成功').subscribe();
          },
          error: () => {
            this.msg.SendMessage('导入账号失败').subscribe();
          }
        })
      }
    });
  }

  userEditPassword(event?: Event, user?: UserInfo) {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(SingleInputComponent, {
      data: {
        title: '修改密码',
        inputLabel: '新密码',
        inputPlaceholder: '输入为此账户设置的新密码'
      }
    });

    // TODO post data to backend
    dialogRef.afterClosed().subscribe()
  }

  tableItemCheckBy(index: number, item: UserInfo) {
    return item.user_id;
  }

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  constructor(private loc: LocationService,
              private route: ActivatedRoute,
              private conn: ConnectionService,
              public msg: MessageService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!data || !data.type || !this.typeString[data.type]) {
        return;
      }
      this.type = data.type;
      this.dataSource = new AccountDataSource(this.conn, this.type, this.paginator,this.msg);
    })
  }
}

export class AccountDataSource extends DataSource<UserInfo> {

  public length: number = 10000;

  public data: UserInfo[] = [];
  private readonly data$: BehaviorSubject<UserInfo[]>;

  private _subscription = new Subscription();

  private index: number = 0;

  private size: number = 10;

  constructor(private conn: ConnectionService,
              private type: string,
              private paginator: MatPaginator,
              public msg: MessageService) {
    super();
    this.data$ = new BehaviorSubject<UserInfo[]>(this.data);

    // TODO update this upon each data fetch
    this.length = 1000;
    this.paginator.page.subscribe((event: PageEvent) => {
      this.index = event.pageIndex;
      this.size = event.pageSize;
      this.getRange().subscribe(data => {
        this.data = data;
        this.data$.next(this.data);
      })
    })
  }

  // TODO request with new filter, and emit new value list
  public applyFilter(filter: AccountFilter) {


  }

  // FinishTodo implement real data fetch
  public getRange(): Observable<UserInfo[]> {
    let observer: Subscriber<UserInfo[]>;
    const result = new Observable<UserInfo[]>(o => observer = o);
    const pageInfoQ: PageInfoQ = {
      page: this.index + 1,
      offset: this.size
    };
    this.conn.GetAllUser(pageInfoQ).subscribe({
      next: resp => {

        if (resp.status !== 0){
          this.msg.SendMessage('获取列表失败').subscribe();
          observer.error()
        }
        this.length = resp.total_rows;
        const list: UserInfo[] = [];
        for (const paginatorElement of resp.data) {
          const getUserInfo: UserInfo = paginatorElement as UserInfo;
          list.push({
            avatar: getUserInfo.avatar,
            email: getUserInfo.email,
            gender: getUserInfo.gender,
            name: getUserInfo.name,
            phone_number: getUserInfo.phone_number,
            role_name: getUserInfo.role_name,
            user_id: getUserInfo.user_id,
            username: getUserInfo.username
          });
        }
        observer.next(list);
      },
      error: err => {
        this.msg.SendMessage('获取列表失败').subscribe();
        observer.error();
      }
    });
    return result
  }

  connect(collectionViewer: CollectionViewer): Observable<UserInfo[] | ReadonlyArray<UserInfo>> {
    // this._subscription.add(collectionViewer.viewChange.subscribe(range => {
    //   if (range.start >= this.length) {
    //     return;
    //   }
    //   this.getRange(range).subscribe(data => {
    //     this.data = data;
    //     this.data$.next(this.data);
    //   })
    // }))
    this.getRange().subscribe(data => {
      this.data = data;
      this.data$.next(this.data);
    })

    return this.data$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this._subscription.unsubscribe();
  }
}

export interface AccountFilter {
  name?: string;
  id?: string;
  organization?: string;
  role?: string;
}
