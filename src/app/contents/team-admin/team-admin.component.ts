import {Component, OnInit, ViewChild} from '@angular/core';
import {CollectionViewer, DataSource, SelectionModel} from "@angular/cdk/collections";
import {Team, UserInfo} from "../../types/types";
import {AccountEditComponent} from "../../popups/account-edit/account-edit.component";
import {AccountBulkAddComponent} from "../../popups/account-bulk-add/account-bulk-add.component";
import {SingleInputComponent} from "../../popups/single-input/single-input.component";
import {LocationService} from "../../services/location.service";
import {ActivatedRoute} from "@angular/router";
import {ConnectionService} from "../../services/connection.service";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

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

  // TODO delete selected team
  teamDelete() {

  }

  teamCreate() {

  }

  teamEdit(event: Event, team: Team) {
    if (event) {
      event.stopPropagation();
    }

    // const dialogRef = this.dialog.open(AccountEditComponent, {
    //   data: user
    // });
    //

    // dialogRef.afterClosed().subscribe()
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
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.dataSource = new TeamDataSource(this.conn, this.paginator);
    })
  }
}

export class TeamDataSource extends DataSource<Team> {

  public length: number = 0;

  public data: Team[] = [];
  private readonly data$: BehaviorSubject<Team[]>;

  private _subscription = new Subscription();

  constructor(private conn: ConnectionService, private paginator: MatPaginator) {
    super();
    this.data$ = new BehaviorSubject<Team[]>(this.data);

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
  public applyFilter(filter: TeamFilter) {
  }

  // TODO implement real data fetch
  private getRange(start: number, end: number): Observable<Team[]> {
    console.log(start, end);
    const list: Team[] = [];

    for (let i = start; i < Math.min(end, this.length); i++) {
      list.push({
        avatar: "",
        name: `team${i}`,
        evaluation: i % 2 === 0 ? '' : 'a',
        id: i,
        project_name: "projectP",
        repo_url: i % 2 === 0 ? '' : "https://github.com",
        team_grade:  i % 2 === 0 ? null : i % 5 + 5,
        train_name: `Train${i}`,
        train_project_id: i,
        member_count: i % 4 + 1,
      })
    }

    return of(list);
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

export interface TeamFilter {
  name?: string;
  id?: string;
  organization?: string;
  role?: string;
}

