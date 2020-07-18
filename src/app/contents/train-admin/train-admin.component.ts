import { Component, OnInit } from '@angular/core';
import {GetOrgQ, Organization, PageInfoQ, Train, TrainQ} from "../../types/types";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {SchoolEditComponent} from "../../popups/school-edit/school-edit.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";
import get = Reflect.get;
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";

const EXAMPLE_TRAIN: Train[] = [{
  id: 1,
  name: '实训1',
  organization_id: 1,
  organization: '组织1',
  start_time: 1594455135343,
  end_time: 1594455155343,
  content: '实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容',
  standard: '验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准',
  resource_lib: '实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源',
  gps_info: '*Some GPS Position*'
}, {
  id: 2,
  name: '实训2',
  organization_id: 1,
  organization: '组织1',
  start_time: 1594455135343,
  end_time: 1594455155343,
  content: '实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容',
  standard: '验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准',
  resource_lib: '实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源',
  gps_info: '*Some GPS Position*'
}, {
  id: 3,
  name: '实训3',
  organization_id: 1,
  organization: '组织1',
  start_time: 1594455135343,
  end_time: 1594455155343,
  content: '实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容',
  standard: '验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准',
  resource_lib: '实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源',
  gps_info: '*Some GPS Position*'
}, {
  id: 4,
  name: '实训4',
  organization_id: 1,
  organization: '组织1',
  start_time: 1594455135343,
  end_time: 1594455155343,
  content: '实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容',
  standard: '验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准',
  resource_lib: '实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源实训资源',
  gps_info: '*Some GPS Position*'
}]

@Component({
  selector: 'app-train-admin',
  templateUrl: './train-admin.component.html',
  styleUrls: ['./train-admin.component.styl'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TrainAdminComponent implements OnInit {

  columns: {[key: string]: string} = {
    id: '#',
    name: '实训名称',
    organization: '实训组织',
    start_time: '开始日期',
    end_time: '结束日期',
  }

  get columnRefs() {
    let keys = Object.keys(this.columns);
    keys.unshift('select');
    keys.push('edit');
    return keys
  }

  get columnPairs() { return Object.entries(this.columns) }
  dataSource: MatTableDataSource<Train>;
  selection = new SelectionModel<Train>(true, []);

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

  // TODO delete train according to selection
  trainDelete() {
    let List: number[] = [];
    this.msg.SendMessage('正在删除实训……').subscribe();
    for (const columnRef of this.selection.selected) {
      List.push(columnRef.id)
    }
    this.conn.DeleteTrain(List).subscribe({
      next: resp => {
        this.msg.SendMessage('删除成功！').subscribe();
      },
      error: err => {
        this.msg.SendMessage(err).subscribe();
      },
      complete: () => {
        this.setDataSource()
      }
    })
  }

  JumpToDetail(train: Train){
    this.loc.go(['/plat/train/detail/',train.id])
  }

  constructor(private conn: ConnectionService,
              public msg: MessageService,
              private route: ActivatedRoute,
              private loc: LocationService) { }

  ngOnInit(): void {
    this.setDataSource()
  }

  setDataSource(){
    const pageInfoQ: PageInfoQ ={
      page: 1 ,
      offset: 100
    }
    this.conn.GetAllTrain(pageInfoQ).subscribe({
      next: resp => {
        if (resp.status === 0) {
          const trainList: Train[] = [];
          for (const columnRef of resp.data) {
            const trainQ: TrainQ = columnRef as TrainQ;
            const train: Train = {
              id: trainQ.id,
              name: trainQ.name,
              content: trainQ.content,
              organization: '',
              organization_id: trainQ.organization_id,
              start_time: new Date(trainQ.start_time).getTime(),
              end_time: new Date(trainQ.end_time).getTime(),
              standard: trainQ.accept_standard,
              gps_info: trainQ.gps_info,
              resource_lib: trainQ.resource_library
            }
            this.conn.GetOrgInfo(trainQ.organization_id).subscribe({
              next: nresp => {
                const getOrgQ: GetOrgQ = nresp.data as GetOrgQ
                train.organization = getOrgQ.real_name;
              },
              error: eresp => {
                train.organization = '错误:未查到相关组织';
              }
            });
            trainList.push(train);
          }
          this.dataSource = new MatTableDataSource<Train>(trainList)
        } else {
          this.msg.SendMessage('获取列表失败。').subscribe()
        }
      },
      error: () => {
        this.msg.SendMessage('获取列表失败。未知错误').subscribe()
        this.dataSource = new MatTableDataSource<Train>(EXAMPLE_TRAIN)
      }

    })
  }

}
