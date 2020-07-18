import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";
import {Organization, UserInfo, RoleTable, DeleteUserQ} from "../../types/types";
import {CollectionViewer, DataSource, ListRange, SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BehaviorSubject, Observable, of, Subscriber, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";

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
  expandedElement: UserInfo | null;

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
        this.conn.GetUserInfo().subscribe()
        window.alert(2);
      },
      error: () => {
        this.msg.SendMessage('删除账号失败。未知错误').subscribe()
        this.conn.GetUserInfo().subscribe()
        window.alert(3);
      }
    })
  }

  userEdit(event?: Event, user?: UserInfo) {
    if (event) {
      event.stopPropagation();
    }

    // TODO edit user info
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
              public msg: MessageService ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!data || !data.type || !this.typeString[data.type]) {
        return;
      }
      this.type = data.type;
      this.dataSource = new AccountDataSource(this.conn, this.type, this.paginator);
    })
  }
}

export class AccountDataSource extends DataSource<UserInfo> {

  public length: number = 0;

  public data: UserInfo[] = [];
  private readonly data$: BehaviorSubject<UserInfo[]>;

  private _subscription = new Subscription();

  constructor(private conn: ConnectionService, private type: string, private paginator: MatPaginator) {
    super();
    this.data$ = new BehaviorSubject<UserInfo[]>(this.data);

    // this should be changed upon each get
    this.length = 1000;
    this.paginator.page.subscribe((event: PageEvent) => {
      const start = event.pageIndex * event.pageSize;
      const end = start + event.pageSize;
      this.getRange(start, end).subscribe(data => {
        this.data = data;
        this.data$.next(this.data);
      })
    })
  }

  // TODO request with new filter, and emit new value list
  public applyFilter(filter: AccountFilter) {


  }

  // TODO implement real data fetch
  private getRange(start: number, end: number): Observable<UserInfo[]> {
    console.log(start, end);
    const list: UserInfo[] = [];

    for (let i = start; i <= Math.min(end, this.length); i++) {
      list.push({
        avatar: "",
        email: `user${i}@mail.com`,
        gender: i % 2 == 0,
        name: `user${i}`,
        phone_number: `12345${i}`,
        role_name: 'ROLE_ENTERPRISE_ADMIN',
        user_id: i,
        username: `TEST000${i}`
      })
    }
    console.log(123)
    return of(list);
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
    this.getRange(0, this.paginator.pageSize).subscribe(data => {
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
