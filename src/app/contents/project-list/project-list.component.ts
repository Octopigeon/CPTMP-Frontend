import { Component, OnInit } from '@angular/core';
import {PageInfoQ, Project, ProjectQ} from "../../types/types";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {ConnectionService} from "../../services/connection.service";

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
  content: "项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介" +
    "项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介" +
    "项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介",
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
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.styl']
})
export class ProjectListComponent implements OnInit {

  projects: Project[];
  train = '实训名称';
  trainId: string;

  checkTrainName(): boolean{
    return !(this.train === '实训名称');
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

  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              public conn: ConnectionService,) { }

  /***
   * 根据从后端查询到的数据对页面的数据进行初始化
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.trainId = params.get('id');
      // TODO change projects and train to real info fetched from backend
      if ( this.trainId == null){
        const pageInfoQ: PageInfoQ = {
          page: 1,
          offset: 100,
        }
        this.conn.GetAllProject(pageInfoQ).subscribe({
          next: value => {
            let projectList: Project[] = [];
            for (const item of value.data) {
              const projectQ: ProjectQ = item as ProjectQ;
              const project: Project = {
                id: projectQ.id,
                name: projectQ.name,
                content: projectQ.content,
                level: projectQ.level,
                resource_lib: projectQ.resource_library
              }
              projectList.push(project);
            }
            this.projects = projectList;
          },
          error: err => {

          }
        })
      }else{

      }
    })
  }

  JumpToDetail(project: Project){
    this.loc.go(['/plat/project/detail/', project.id]);
  }

  teamCreate() {
    this.loc.go(['/plat/team/detail/new']);
  }

  jumpToTeamList(id: number){
    const index: string = '0&' + id;
    this.loc.go(['/plat/teamList/', index]);
  }

}
