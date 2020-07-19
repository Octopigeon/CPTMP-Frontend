import { Component, OnInit } from '@angular/core';
import {Team, UserInfo} from "../../types/types";

@Component({
  selector: 'app-join-request',
  templateUrl: './join-request.component.html',
  styleUrls: ['./join-request.component.styl']
})
export class JoinRequestComponent implements OnInit {

  data: Team = {
    avatar: "",
    name: `team1`,
    evaluation: '',
    id: 1,
    project_name: "projectP",
    repo_url: "https://github.com",
    team_grade: null,
    train_name: `Train1`,
    train_project_id: 1,
    member_count: 1,
    leader_id: 1
  }

  user: UserInfo = {
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user1`,
    phone_number: `123451`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 1,
    username: `TEST0001`
  }

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
