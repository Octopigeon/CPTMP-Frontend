import { Component, OnInit } from '@angular/core';
import {GetTeamQ, Notice, PageInfoQ, Team, UserInfo} from "../../types/types";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {ConnectionService} from "../../services/connection.service";
import {Logger} from "../../services/logger.service";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.styl']
})
export class TeamListComponent implements OnInit {

  train = '实训aaaa';
  project = '项目bbbb';

  teamList: Team[];

  teams: Team[];

  user: UserInfo;

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              private conn: ConnectionService,
              private logger: Logger,
              private msg: MessageService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // TODO fetch real data according to link parameters
      const index = params.get('index');
      if (index != null){
        const indexs: string[] = index.split('&');
        if (indexs[0] !== '0'){
          this.GetDataByTrain(indexs[0]);
        }else{
          this.GetDataByProject(indexs[1]);
        }
      }else {
        this.GetData();
      }
    });
    this.conn.user.subscribe(user => {
      this.user = user.info;
    });
  }

  JumpToDetail(team: Team){
    this.loc.go(['/plat/team/detail/', team.id]);
  }

  GetDataByTrain(id: string){
    this.conn.GetTeamByTrain(id).subscribe({
      next: value => {
        console.log(value.data);
      },
      error: err => {

      }
    })
  }

  GetDataByProject(id: string){
    this.conn.GetTeamByProject(id).subscribe({
      next: value => {

      },
      error: err => {

      }
    })
  }

  JoinTeam(team: Team){
    const con = '申请加入:' + this.user.name + '同学申请加入您的团队[' + team.name + ']';
    const notice: Notice = {
      sender_id: this.user.user_id,
      receiver_id: team.leader_id,
      team_id: team.id,
      content: con,
      is_read: false,
      type: 'Message',
    };
    this.conn.PostNotice(notice).subscribe({
      next: value => {
        if ( value.status !== 0){
          this.msg.SendMessage('提交申请失败').subscribe();
        }else{
          this.msg.SendMessage('提交申请成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('提交申请失败。未知错误').subscribe();
      }
    });
  }

  GetData(){
    const pageInfoQ: PageInfoQ = {
      page: 1,
      offset: 100,
    }
    this.conn.GetTeamList(pageInfoQ).subscribe({
      next: value => {
        if (value.status !== 0 ){
          this.msg.SendMessage('获取队伍信息失败').subscribe();
        }else{
          this.teamList = [];
          for (const item of value.data) {

            const getTeamQ: GetTeamQ = item as GetTeamQ;
            const team: Team = {
              avatar: getTeamQ.avatar,
              name: getTeamQ.name,
              id: getTeamQ.id,
              project_name: getTeamQ.project_name,
              train_name: getTeamQ.train_name,
              train_project_id: getTeamQ.project_id,
              member_count: getTeamQ.size,
              leader_id: getTeamQ.team_master_id,
              members: getTeamQ.member,
            };
            this.teamList.push(team);
          }
          this.teams = this.teamList;
        }
      },
      error: err => {

      }
    });
  }

}
