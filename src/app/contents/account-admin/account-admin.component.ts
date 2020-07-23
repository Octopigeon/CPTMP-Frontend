import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";
import {
  Organization,
  UserInfo,
  RoleTable,
  DeleteUserQ,
  PageInfoQ,
  Resp,
  PostRegisterQ,
  ChangPwdByForce, ModifyUserBasicInfoQ
} from "../../types/types";
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

  /***
   * 将选取的用户从系统中删除
   */

  // FinshTodo delete selected user
  userDelete() {

    this.msg.SendMessage('正在删除账号……').subscribe()
    const userList: number[] = [];
    for (const typeElement of this.selection.selected) {
      userList.push(typeElement.user_id);
    }
    console.log(userList);
    this.conn.DeleteUser(userList).subscribe({  // 调用连接类ConnectionService进连接，删除所选列表
      next: resp => {
        this.msg.SendMessage('删除账号成功').subscribe()
      },
      error: () => {
        this.msg.SendMessage('删除账号失败。未知错误').subscribe()
      },
      complete: () => {
        this.dataSource.setData();    // 删除后更新列表
      }
    })
  }

  /***
   * 对选定用户的信息进行修改
   * @param event  调用此方法的对应列表项
   * @param user   进行修改的用户对象原信息，可为无，若不传入，则为创建新用户
   */

  userEdit(event?: Event, user?: UserInfo) {
    if (event) {
      event.stopPropagation();
    }
    const dialogRef = this.dialog.open(AccountEditComponent, {
      data: user
    });

    // TODO get data & post create/modify request to backend
    dialogRef.afterClosed().subscribe(result => {  // 获取弹窗返回结果数据
      if ( user == null ){    // 若开始时没有传入用户对象，则为创建新用户
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
            },
            complete: () => {
              this.dataSource.setData();
            }
          })
        }
      }else{   // 若传入了用户对象，则对其进行修改
        if (result == null){
          this.msg.SendMessage('修改用户信息取消').subscribe();
          return;
        }
        const modifyUserBasicInfoQ: ModifyUserBasicInfoQ = result as ModifyUserBasicInfoQ;
        this.conn.UpdateUserInfoByForce(modifyUserBasicInfoQ, user.user_id).subscribe({
          next: value => {
            if (value.status !== 0 ){
              this.msg.SendMessage('修改用户信息失败').subscribe();
            }else{
              this.msg.SendMessage('修改用户信息成功').subscribe();
            }
          },
          error: err => {
            this.msg.SendMessage('修改用户信息失败。未知错误').subscribe();
          },
          complete: () => {
            this.dataSource.setData()
          }
        });
      }
    });
  }

  /***
   * 根据csv文件批量导入用户
   * @param event 调用此方法的对象
   */
  userBulkAdd(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(AccountBulkAddComponent);

    // FinishTodo post data to backend
    dialogRef.afterClosed().subscribe(result => {  // 获取弹窗关闭后的结果数据
      if (result == null){
        this.msg.SendMessage('导入被取消').subscribe();
      }else{
        console.log(result);
      }
    });
  }

  /***
   * 利用系统管理员最高权限直接修改用户密码
   * @param event  调用此方法的对象
   * @param user  传入此方法的对象用户的信息
   */
  userEditPassword(event?: Event, user?: UserInfo) {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(SingleInputComponent, {   // 为弹窗输入内容
      data: {
        title: '修改密码',
        inputLabel: '新密码',
        inputPlaceholder: '输入为此账户设置的新密码'
      }
    });

    // TODO post data to backend
    dialogRef.afterClosed().subscribe(result => {
      if (result == null){
        this.msg.SendMessage('修改密码取消').subscribe();
        return;
      }
      const newPassword: ChangPwdByForce = {
        username: user.username,
        new_password: result
      }
      this.conn.ChangePassWordByForce(newPassword).subscribe({
        next: resp => {
          if (resp.status !== 0) {
            this.msg.SendMessage('密码修改失败').subscribe()
            return;
          }
          this.msg.SendMessage('密码修改成功').subscribe()
        },
        error: () => {
          this.msg.SendMessage('密码修改失败。未知错误').subscribe()
        }
      })
    })
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

  /***
   * 页面初始化，分页获取用户信息
   */
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
      this.setData()
    })
  }

  // TODO request with new filter, and emit new value list
  public applyFilter(filter: AccountFilter) {


  }

  setData(){
    this.getRange().subscribe(data => {
      this.data = data;
      this.data$.next(this.data);
    })
  }

  /***
   *  根据当前的页标，分页查询用户信息
   */
  // FinishTodo implement real data fetch
  public getRange(): Observable<UserInfo[]> {
    let observer: Subscriber<UserInfo[]>;
    const result = new Observable<UserInfo[]>(o => observer = o);
    const pageInfoQ: PageInfoQ = {  // 生成查询页的请求
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
        for (const paginatorElement of resp.data) {  // 分页装载查询获得的用户信息
          const getUserInfo: UserInfo = paginatorElement as UserInfo;
          list.push({
            avatar: getUserInfo.avatar,
            email: getUserInfo.email,
            gender: getUserInfo.gender,
            name: getUserInfo.name,
            phone_number: getUserInfo.phone_number,
            role_name: getUserInfo.role_name,
            user_id: getUserInfo.user_id,
            introduction: getUserInfo.introduction,
            username: getUserInfo.username,
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
