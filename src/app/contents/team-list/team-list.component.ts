import { Component, OnInit } from '@angular/core';
import {PageInfoQ, Team} from "../../types/types";
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

  teams: Team[] = [{
    avatar: "",
    name: `team1`,
    id: 1,
    project_name: "projectP",
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
    }]
  }, {
    avatar: "",
    name: `team2`,
    id: 1,
    project_name: "projectP",
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
    }]
  }, {
    avatar: "",
    name: `team4`,
    id: 1,
    project_name: "projectP",
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
    }]
  }]

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

  GetData(){
    const pageInfoQ: PageInfoQ = {
      page: 1,
      offset: 100,
    }
    this.conn.GetAllTeam(pageInfoQ).subscribe({
      next: value => {

      },
      error: err => {

      }
    });
  }

}
