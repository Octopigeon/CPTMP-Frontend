import { Component, OnInit } from '@angular/core';
import {Project} from "../../types/types";
import {ActivatedRoute} from "@angular/router";

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

  projects = EXAMPLE_PROJECT;
  train = '实训名称';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // TODO change projects and train to real info fetched from backend
    })
  }

}
