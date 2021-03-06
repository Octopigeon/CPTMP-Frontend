

import {Component, OnInit, ViewChild} from '@angular/core';
import {Organization, CreateOrgQ, PageInfoQ, GetOrgQ} from '../../types/types';
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

const err: Organization[] = [{
  id: 0,
  name: 'error',
  code: 'error',
  description: 'error',
  url: 'http://error.error.error',
  invitation_code: 'error',
  created: 0
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

  organizationList: Organization[];


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

  /***
   * 根据用户的传入，对组织进行创建和修改
   * @param organization  用户传入的组织对象
   */
  schoolEdit(organization?: Organization) {
    const dialogRef = this.dialog.open(SchoolEditComponent, {
      data: organization
    });

    // FinishTodo get data & post create/modify request to backend

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        if (organization == null){      // 若用户未传入组织对象，则创建新组织
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
          },
          complete: () => {
            this.getDate();
          }
        });

      }else{
        // 若传入了对象组织，则对其信息进行修改
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
            }else{
              this.msg.SendMessage('组织信息修改失败').subscribe();
            }
          },
          error: () => {
            this.msg.SendMessage('组织信息修改失败。未知错误').subscribe();
          }
        });

      }
    });
  }

  /***
   * 根据用户的选择对组织进行删除
   */
  // TODO delete scholl according to selection
  schoolDelete() {
    this.msg.SendMessage('正在删除组织').subscribe();
    const orgId: number[] = [];
    for (const selectionElement of this.selection.selected) {
      orgId.push(selectionElement.id);
    }
    console.log(orgId);
    this.conn.DeleteOrg(orgId).subscribe({
      next: value => {
          this.msg.SendMessage('删除组织成功').subscribe();
      },
      error: err1 => {
        this.msg.SendMessage('删除组织失败。未知错误').subscribe();
      },
      complete: () => {
        this.getDate();
      }
    });
  }

  // TODO send request to regenerate invitation code
  regenerateInviteCode() {

  }

  // TODO get invite link from invitation code
  getInviteLink(invitation_code: string) {
    return invitation_code;
  }

  /**
   * 查询所有组织信息
   */
  getDate(){
    this.organizationList = [];   // 形成查询分页请求
    const pageInfoQ: PageInfoQ = {
      page: 1,
      offset: 100,
    };
    this.conn.GetAllOrg(pageInfoQ).subscribe({
      next: resp => {
        if (resp.status !== 0){
          this.organizationList = err;
          this.msg.SendMessage('获取组织列表失败').subscribe();
          this.dataSource = new MatTableDataSource<Organization>(this.organizationList);
          return;
        }
        for (const connElement of resp.data) {   // 载入各个组织信息
          const organization: GetOrgQ = connElement as GetOrgQ;
          console.log(organization.gmt_create)
          const org: Organization = {
            id: organization.id,
            name: organization.real_name,
            code: organization.name,
            description: organization.description,
            url: organization.website_url,
            invitation_code: ' ',
            created: new Date(organization.gmt_create).getTime()
          };
          this.organizationList.push(org);
        }
        this.dataSource = new MatTableDataSource<Organization>(this.organizationList);
        return;
      },
      error: error => {
        this.organizationList = err;
        this.msg.SendMessage('获取组织列表失败。未知错误').subscribe()
        this.dataSource = new MatTableDataSource<Organization>(this.organizationList);
        return;
      }
    });
  }

  constructor(public dialog: MatDialog,
              public msg: MessageService,
              public conn: ConnectionService,
              private loc: LocationService,
              private logger: Logger,
              private route: ActivatedRoute) { }



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.getDate();  // 载入所有组织信息
    });
      // TODO fetch data from backend
  }

}

