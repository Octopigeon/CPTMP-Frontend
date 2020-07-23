import { Component, OnInit } from '@angular/core';
import {GetTeamQ, Team, UserInfo} from "../../types/types";
import {ActivatedRoute} from "@angular/router";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";

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

  constructor(private route: ActivatedRoute,
              private conn: ConnectionService,
              private msg: MessageService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // TODO fetch real data according to link parameters
      const index = params.get('index');
      const id: string[] = index.split('&');
      this.GetTeamInfo(Number(id[1]));
    });
  }

  GetUserInfo(id: number){

  }

  GetTeamInfo(id: number){
    this.conn.GetTeamInfo(id).subscribe({
      next: value => {
        const getTeamQ: GetTeamQ = value.data as GetTeamQ;
        const teamData: Team = {
          avatar: getTeamQ.avatar,
          name: getTeamQ.name,
          evaluation: getTeamQ.evaluation,
          id: getTeamQ.id,
          project_name: getTeamQ.project_name,
          repo_url: getTeamQ.repo_url,
          team_grade: getTeamQ.team_grade,
          train_name: getTeamQ.train_name,
          train_project_id: getTeamQ.train_id,
          member_count: getTeamQ.size,
          leader_id: getTeamQ.team_master_id,
        };
        this.data = teamData;
      },
      error: err => {
        this.msg.SendMessage('获取团队信息失败').subscribe();
      }
    });
  }

}
