import { Component, OnInit } from '@angular/core';
import {Team} from "../../types/types";

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.styl']
})
export class TeamListComponent implements OnInit {

  train = '实训aaaa';
  project = '项目bbbb';

  teams: Team[] = [{
    avatar: "",
    name: `team1`,
    id: 1,
    project_name: "projectP",
    train_name: `Train1`,
    train_project_id: 1,
    member_count: 1,
    members: [{
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user1`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0001`
    }]
  }, {
    avatar: "",
    name: `team2`,
    id: 1,
    project_name: "projectP",
    train_name: `Train1`,
    train_project_id: 1,
    member_count: 1,
    members: [{
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user1`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0001`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user2`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0002`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user3`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0003`
    }]
  }, {
    avatar: "",
    name: `team3`,
    id: 1,
    project_name: "projectP",
    train_name: `Train1`,
    train_project_id: 1,
    member_count: 1,
    members: [{
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user1`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0001`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user2`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0002`
    }]
  }, {
    avatar: "",
    name: `team4`,
    id: 1,
    project_name: "projectP",
    train_name: `Train1`,
    train_project_id: 1,
    member_count: 1,
    members: [{
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user1`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0001`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user2`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0002`
    }]
  }]

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  constructor() { }

  ngOnInit(): void {
  }

}
