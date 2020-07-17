
import {Component, OnInit, ViewChild} from '@angular/core';
import {Organization, CreateOrgQ} from '../../types/types';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ChangeAvatarComponent} from '../../popups/change-avatar/change-avatar.component';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SchoolEditComponent} from '../../popups/school-edit/school-edit.component';
import {MessageService} from '../../services/message.service';
import {ConnectionService} from '../../services/connection.service';
import {LocationService} from '../../services/location.service';
import {Logger} from '../../services/logger.service';
import {ActivatedRoute} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";


// these can be removed once real api is implemented
const EXAMPLE_ORGANIZATION: Organization[] = [{
  id: 1,
  name: 'a',
  code: 'aau',
  description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: 'http://aaa.aa.aa/aaaaaaaaaaaaaaaaaaaaaaaa/aaaaa/aaa.html',
  invitation_code: 'asdbfwbiewninepvernobmeowbnebbrsptmbrwrmnt',
  created: 1594455135343
}, {
  id: 2,
  name: 's',
  code: 'ssu',
  description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: 'http://aaa.aa.aa',
  invitation_code: 'asdbfwbiewninepvernobmeowbnebbrsptmbrwrmnt',
  created: 1594455135343
}, {
  id: 3,
  name: 'b',
  code: 'bbu',
  description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: 'http://aaa.aa.aa',
  invitation_code: 'asdbfwbiewninepvernobmeowbnebbrsptmbrwrmnt',
  created: 1594455135343
}, {
  id: 4,
  name: 'c',
  code: 'ccu',
  description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: 'http://aaa.aa.aa',
  invitation_code: 'asdbfwbiewninepvernobmeowbnebbrsptmbrwrmnt',
  created: 1594455135343
}, {
  id: 5,
  name: 'd',
  code: 'ddu',
  description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  url: 'http://aaa.aa.aa',
  invitation_code: 'asdbfwbiewninepvernobmeowbnebbrsptmbrwrmnt',
  created: 1594455135343
}];

@Component({
  selector: 'app-school-admin',
  templateUrl: './school-admin.component.html',
  styleUrls: ['./school-admin.component.styl'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SchoolAdminComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columns: {[key: string]: string} = {
    id: '#',
    name: '组织名称',
    code: '组织代号',
    created: '创建日期',
  };

  type: string;

  get columnRefs() {
    const keys = Object.keys(this.columns);
    keys.unshift('select');
    return keys;
  }

  get columnPairs() { return Object.entries(this.columns); }




  dataSource: MatTableDataSource<Organization>;
  selection = new SelectionModel<Organization>(true, []);
  expandedElement: Organization | null;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  toDateString(date: number | string) {
    return (new Date(date)).toLocaleDateString();
  }

  schoolEdit(organization?: Organization) {
    const dialogRef = this.dialog.open(SchoolEditComponent, {
      data: organization
    });

    // FinishTodo get data & post create/modify request to backend

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        if (organization == null){
          this.msg.SendMessage('创建被取消').subscribe();
        }else{
          this.msg.SendMessage('修改被取消').subscribe();
        }
        return
      }
      if (organization == null) {
        this.msg.SendMessage('正在创建新组织……').subscribe();
        const org: CreateOrgQ = {
          real_name: result.name,
          code: result.code,
          website_url: result.url,
          description: result.description
        };
        const orgList: CreateOrgQ[] = [org];
        this.conn.CreateOrganization(orgList).subscribe({
          next: resp => {
            if (resp.status === 0) {
              this.msg.SendMessage('新组织创建成功').subscribe();
            }
          },
          error: () => {
            this.msg.SendMessage('新组织创建失败。未知错误').subscribe();
          }
        });

      }else{

        this.msg.SendMessage('正在修改组织信息……').subscribe();
        const org: CreateOrgQ = {
          real_name: result.name,
          code: result.code,
          website_url: result.url,
          description: result.description
        };
        this.conn.UploadOrgBasicInfo(org).subscribe({
          next: resp => {
            if (resp.status === 0) {
              this.msg.SendMessage('组织信息修改成功').subscribe();
            }
          },
          error: () => {
            this.msg.SendMessage('组织信息修改失败。未知错误').subscribe();
          }
        });

      }
    });
  }

  // TODO delete scholl according to selection
  schoolDelete() {

    this.msg.SendMessage('正在删除组织').subscribe()


  }

  // TODO send request to regenerate invitation code
  regenerateInviteCode() {

  }

  // TODO get invite link from invitation code
  getInviteLink(invitation_code: string) {
    return invitation_code;
  }

  constructor(public dialog: MatDialog,
              public msg: MessageService,
              public conn: ConnectionService,
              private loc: LocationService,
              private logger: Logger,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Organization>(EXAMPLE_ORGANIZATION)
  }

}

