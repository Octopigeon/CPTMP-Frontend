import { Component, OnInit } from '@angular/core';
import {Team} from "../../types/types";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.styl']
})
export class InviteComponent implements OnInit {

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
    leader_id: 1,
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
      username: `TEST0002`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user4`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0002`
    }, {
      avatar: "",
      email: `user1@mail.com`,
      gender: true,
      name: `user5`,
      phone_number: `123456`,
      role_name: 'ROLE_ENTERPRISE_ADMIN',
      user_id: 1,
      username: `TEST0002`
    }],
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
