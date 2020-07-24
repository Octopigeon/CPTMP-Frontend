import { Component, OnInit } from '@angular/core';
import {GetTeamQ, Notice, Team, UserInfo} from "../../types/types";
import {ActivatedRoute} from "@angular/router";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";
import {LocationService} from "../../services/location.service";

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

  me: UserInfo;

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  constructor(private route: ActivatedRoute,
              private conn: ConnectionService,
              private msg: MessageService,
              private loc: LocationService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // TODO fetch real data according to link parameters
      const index = params.get('index');
      const id: string[] = index.split('&');
      this.GetTeamInfo(Number(id[1]));
      this.GetUserInfo(Number(id[0]));
    });
    this.conn.user.subscribe(user => {
      this.me = user.info;
    });
  }

  accept(){
    const member: number[] = [this.user.user_id];
    this.conn.AddTeamMember(this.data.id, member).subscribe({
      next: value => {
        if ( value.status !== 0 ){
          this.msg.SendMessage('添加队员失败').subscribe();
        }else{
          this.sendAcceptMessage();
        }
      },
      error: err => {
        this.msg.SendMessage('添加队员失败。未知错误').subscribe();
      }
    })
  }

  sendAcceptMessage(){
    const notice: Notice = {
      sender_id: this.me.user_id,
      receiver_id: this.user.user_id,
      team_id: this.data.id,
      content: '接受申请:' + this.data.name + '团队同意了你的入队申请。',
      is_read: false,
      type: 'Message',
    };
    this.conn.PostNotice(notice).subscribe({
      next: value => {
        if (value.status !== 0) {
          this.msg.SendMessage('回复失败').subscribe();
        } else {
          this.msg.SendMessage('回复成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('回复失败。未知错误').subscribe();
      },
      complete: () => {
        this.loc.go(['plat/user/message']);
      }
    })
  }

  refuse(){
    const notice: Notice = {
      sender_id: this.me.user_id,
      receiver_id: this.user.user_id,
      team_id: this.data.id,
      content: '拒绝申请:' + '非常可惜，' + this.data.name + '团队拒绝了你的入队申请。',
      is_read: false,
      type: 'Message',
    };
    this.conn.PostNotice(notice).subscribe({
      next: value => {
        if (value.status !== 0) {
          this.msg.SendMessage('回复失败').subscribe();
        } else {
          this.msg.SendMessage('回复成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('回复失败。未知错误').subscribe();
      },
      complete: () => {
        this.loc.go(['plat/user/message']);
      }
    });
  }

  GetUserInfo(id: number){
    const idList: number[] = [id];
    this.conn.GetUserInfoById(idList).subscribe({
      next: value => {
        const tuser: UserInfo = value.data[0] as UserInfo;
        this.user = tuser;
      },
      error: err => {
        this.msg.SendMessage('获取个人信息失败').subscribe();
      }
    });
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
          members: getTeamQ.member,
        };
        this.data = teamData;
      },
      error: err => {
        this.msg.SendMessage('获取团队信息失败').subscribe();
      }
    });
  }

}
