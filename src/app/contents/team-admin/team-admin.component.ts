import {Component, OnInit, ViewChild} from '@angular/core';
import {CollectionViewer, DataSource, SelectionModel} from "@angular/cdk/collections";
import {GetTeamQ, PageInfoQ, Resp, Team, UserInfo} from "../../types/types";
import {AccountEditComponent} from "../../popups/account-edit/account-edit.component";
import {AccountBulkAddComponent} from "../../popups/account-bulk-add/account-bulk-add.component";
import {SingleInputComponent} from "../../popups/single-input/single-input.component";
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";
import {ConnectionService} from "../../services/connection.service";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject, Observable, of, Subscriber, Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-team-admin',
  templateUrl: './team-admin.component.html',
  styleUrls: ['./team-admin.component.styl']
})
export class TeamAdminComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: TeamDataSource;

  columns: {[key: string]: string} = {
    id: '#',
    name: '团队名称',
    avatar: '团队头像',
    repo_url: '团队仓库',
    train_name: '实训',
    project_name: '项目',
    member_count: '团队人数',
    team_grade: '评分'
  }

  get columnRefs() {
    let keys = Object.keys(this.columns);
    keys.unshift('select');
    keys.push('edit');
    return keys
  }

  get columnPairs() { return Object.entries(this.columns) }
  selection = new SelectionModel<Team>(true, []);

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
   * 根据用户选择删除对应团队
   */
  // TODO delete selected team
  teamDelete(): void{
    let List: number[] = [];
    this.msg.SendMessage('正在删除实训……').subscribe();
    for (const columnRef of this.selection.selected) {
      List.push(columnRef.id);
    }
    this.conn.DeleteTrain(List).subscribe({
      next: resp => {
        this.msg.SendMessage('删除成功！').subscribe();
      },
      error: err => {
        this.msg.SendMessage(err).subscribe();
      },
      complete: () => {
        this.dataSource.getRange();
      }
    })
  }

  /**
   * 创建团队
   */
  teamCreate() {
    this.loc.go(['/plat/team/detail/new']);
  }

  /***
   * 根据传入对团队信息进行修改
   * @param event  调用此方法的对象
   * @param team  传入的团队对象信息
   */
  teamEdit(event: Event, team: Team) {
    this.loc.go(['/plat/team/detail/', team.id]);
  }

  tableItemCheckBy(index: number, item: Team) {
    return item.id;
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
              private dialog: MatDialog,
              public msg: MessageService) { }

  /***
   * 初始化，分页查询获得团队信息
   */
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.dataSource = new TeamDataSource(this.conn, this.paginator, this.msg);
    })
  }
}

export class TeamDataSource extends DataSource<Team> {

  public length: number = 0;

  public data: Team[] = [];
  private readonly data$: BehaviorSubject<Team[]>;

  private index: number = 1;

  private size: number = 10;

  private _subscription = new Subscription();

  constructor(private conn: ConnectionService,
              private paginator: MatPaginator,
              public msg: MessageService) {
    super();
    this.data$ = new BehaviorSubject<Team[]>(this.data);

    // this should be changed upon each get
    this.length = 10;
    this.paginator.page.subscribe((event: PageEvent) => {
      this.size = event.pageSize;
      this.index = event.pageIndex;
      this.getRange().subscribe(data => {
        this.data = data;
        this.data$.next(this.data);
      })
    })
  }

  // TODO request with new filter, and emit new value list
  public applyFilter(filter: TeamFilter) {
  }

  // TODO implement real data fetch
  public getRange(): Observable<Team[]> {
    let observer: Subscriber<Team[]>;
    const result = new Observable<Team[]>(o => observer = o);
    const pageInfoQ: PageInfoQ = {
      page : this.index ,
      offset: this.size
    };
    console.log(pageInfoQ);
    const list: Team[] = [];
    this.conn.GetAllTeam(pageInfoQ).subscribe({
      next: value => {
        console.log(value)
        if (value.status !== 0){
          this.msg.SendMessage('获取团队信息失败').subscribe();
          observer.error();
        }else{
          console.log(value);
          this.length = value.total_rows
          for (const valueElement of value.data) {
            const teamQ: GetTeamQ = valueElement as GetTeamQ;
            list.push({
              avatar: teamQ.avatar,
              name: teamQ.name,
              evaluation: teamQ.evaluation,
              id: teamQ.id,
              project_name: '123',
              repo_url: teamQ.repo_url,
              team_grade: teamQ.team_grade,
              train_name: `Train`,
              train_project_id: teamQ.train_id,
              member_count: 1,
              leader_id: 1
            })
          }
          observer.next(list);
          observer.complete();
        }
      },
      error: err => {
        this.msg.SendMessage('获取团队信息失败。未知错误').subscribe();
        observer.error();
      }
    });
    return result;
  }

  connect(collectionViewer: CollectionViewer): Observable<Team[] | ReadonlyArray<Team>> {
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

export interface TeamFilter {
  name?: string;
  id?: string;
  organization?: string;
  role?: string;
}

