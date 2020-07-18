import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Project, Train} from "../../types/types";
import {SelectionModel} from "@angular/cdk/collections";
import {MessageService} from "../../services/message.service";
import {ConnectionService} from "../../services/connection.service";
import {LocationService} from "../../services/location.service";
import {Logger} from "../../services/logger.service";

const EXAMPLE_PROJECT: Project[] = [{
  id: 1,
  name: "Project1",
  level: 3,
  content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  resource_lib: [],
}, {
  id: 2,
  name: "Project2",
  level: 4,
  content: "项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介",
  resource_lib: [],
}, {
  id: 3,
  name: "Project3",
  level: 4,
  content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  resource_lib: [],
}, {
  id: 4,
  name: "Project4",
  level: 5,
  content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  resource_lib: [],
}]

@Component({
  selector: 'app-project-admin',
  templateUrl: './project-admin.component.html',
  styleUrls: ['./project-admin.component.styl']
})
export class ProjectAdminComponent implements OnInit {

  columns: {[key: string]: string} = {
    id: '#',
    name: '项目名称',
    level: '项目等级',
    content: '项目内容'
  }

  get columnRefs() {
    let keys = Object.keys(this.columns);
    keys.unshift('select');
    keys.push('edit');
    return keys
  }

  get columnPairs() { return Object.entries(this.columns) }
  dataSource = new MatTableDataSource<Project>(EXAMPLE_PROJECT);
  selection = new SelectionModel<Project>(true, []);

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

  capLevel(level: number): number {
    if (level < 0) {
      return 0
    }
    if (level > 5) {
      return 5;
    }
    return Math.round(level)
  }

  range(count: number, begin: number = 0) {
    return [...Array(count).keys()].map(i => i + begin);
  }

  // TODO delete project according to selection
  projectDelete() {
    this.msg.SendMessage('正在删除项目……').subscribe()
    const projectList: number[] = [];
    for (const typeElement of this.selection.selected) {
      projectList.push(typeElement.id);
    }
    console.log(projectList);
    this.conn.DeleteProject(projectList).subscribe({
      next: resp => {
        this.msg.SendMessage('删除项目成功').subscribe()
        this.conn.GetUserInfo().subscribe()
        window.alert(2);
      },
      error: () => {
        this.msg.SendMessage('删除项目失败。未知错误').subscribe()
        this.conn.GetUserInfo().subscribe()
        window.alert(3);
      }
    })
  }

  constructor(public msg: MessageService,
              public conn: ConnectionService,
              private loc: LocationService,
              private logger: Logger) { }

  ngOnInit(): void {
  }

}