import { Component, OnInit } from '@angular/core';
import {Organization, Train} from "../../types/types";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {SchoolEditComponent} from "../../popups/school-edit/school-edit.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
  dataSource = new MatTableDataSource<Train>(EXAMPLE_TRAIN);
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

  }

  constructor() { }

  ngOnInit(): void {
  }

}
