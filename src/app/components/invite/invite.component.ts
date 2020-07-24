import { Component, OnInit } from '@angular/core';
import {GetTeamQ, Notice, Team, UserInfo} from "../../types/types";
import {ActivatedRoute} from "@angular/router";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.styl']
})
export class InviteComponent implements OnInit {

  data: Team ;

  me: UserInfo;

  isEmpty = true;

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
    });
  }

  accept(){
    const member: number[] = [this.me.user_id]
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
      receiver_id: this.data.leader_id,
      team_id: this.data.id,
      content: '接受邀请:' + '恭喜！' + this.me.name + '同学同意了你的入队邀请。',
      is_read: false,
      type: 'Message',
    };
    this.conn.PostNotice(notice).subscribe({
      next: value => {
        if ( value.status !== 0){
          this.msg.SendMessage('回复失败').subscribe();
        }else{
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

  refuse(){
    const notice: Notice = {
      sender_id: this.me.user_id,
      receiver_id: this.data.leader_id,
      team_id: this.data.id,
      content: '拒绝邀请:' + '非常可惜，' + this.me.name + '同学拒绝了你的入队邀请。',
      is_read: false,
      type: 'Message',
    };
    this.conn.PostNotice(notice).subscribe({
      next: value => {
        if ( value.status !== 0){
          this.msg.SendMessage('回复失败').subscribe();
        }else{
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
        this.isEmpty = false;
        this.data = teamData;
      },
      error: err => {
        this.msg.SendMessage('获取团队信息失败').subscribe();
      }
    });
  }

}
