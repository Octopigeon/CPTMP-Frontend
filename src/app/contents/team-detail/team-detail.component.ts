import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSelectionList} from "@angular/material/list";
import {GetTeamQ, Notice, PageInfoQ, Project, ProjectQ, ResourceFile, Team, TrainQ, UserInfo} from "../../types/types";
import {StatedFormControl} from "../../shared/stated-form-control";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatDialog} from "@angular/material/dialog";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {ChangeAvatarComponent} from "../../popups/change-avatar/change-avatar.component";
import {Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, tap} from "rxjs/operators";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MessageService} from "../../services/message.service";
import {ConnectionService} from "../../services/connection.service";

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.styl']
})
export class TeamDetailComponent implements OnInit {

  @ViewChild(MatSelectionList) fileSelection: MatSelectionList;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  data: Team = {
    avatar: "",
    name: `新队伍`,
    evaluation: '',
    id: 0,
    project_name: "projectP",
    repo_url: "https://github.com",
    team_grade: null,
    train_name: `trainT`,
    train_project_id: 1,
    member_count: 1,
    leader_id: 1,
    members: [],
    resource_lib: []
  }

  trains = new Map<number, string>();

  projects = new Map<number, string>();
  /***
   * 初始化页面信息
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userInputControl = new FormControl();
  filteredUsers$: Observable<UserInfo[]>;
  filteredUsers: UserInfo[];
  // should be sync with users
  userIDs = new Set(this.data.members.map(u => u.user_id));
  users: UserInfo[];
  userEditing: boolean = false;
  leaderID: number;

  allUsers: UserInfo[] = [{
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user1`,
    phone_number: `123456`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 1,
    username: `TESTz001`
  }, {
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user2`,
    phone_number: `123456`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 2,
    username: `TESTa002`
  }, {
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user3`,
    phone_number: `123456`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 3,
    username: `TESTb003`
  }, {
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user4`,
    phone_number: `123456`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 4,
    username: `TESTd004`
  }, {
    avatar: "",
    email: `user1@mail.com`,
    gender: true,
    name: `user5`,
    phone_number: `123456`,
    role_name: 'ROLE_ENTERPRISE_ADMIN',
    user_id: 5,
    username: `TESTf005`
  }];

  controls: { [key: string]: StatedFormControl } = {
    name: new StatedFormControl(''),
    evaluation: new StatedFormControl(''),
    repo_url: new StatedFormControl(''),
    team_grade: new StatedFormControl(''),
    train_id: new StatedFormControl(''),
    project_id: new StatedFormControl(),
  }

  editMode: boolean = true;

  createMode: boolean = true;

  privileged: boolean = true;

  editFile: boolean = true;

  train_list = Object.entries(this.trains)

  teamId: string;

  me: UserInfo;

  getProjects(train_id: number): [string, string][] {
    // TODO change to fetch [train_project_id, project_name] according to given train_id
    this.GetProject(train_id)
    return Object.entries(this.projects);
  }

  projects$: Observable<[string, string][]>;

  private _filterUser(value: string): UserInfo[] {
    // TODO change to real fetch (with entry count limit)
    if (!value) {
      // for user adding, hint when no keyword given is meaningless
      return [];
    }

    const filterValue = value.toLowerCase()
    return this.allUsers.filter(user => (user.name.toLowerCase().includes(filterValue) ||
                                        user.username.toLowerCase().includes(filterValue)) &&
                                        !this.userIDs.has(user.user_id));
  }

  removeUser(user: UserInfo) {
    const index = this.users.findIndex(value => value.user_id === user.user_id);

    if (index >= 0) {
      this.users.splice(index, 1);
      this.userIDs.delete(user.user_id);
      this.conn.DeleteTeamMember(user.user_id,this.data.id).subscribe({
        next: value => {
          if(value.status !== 0 ){
            this.msg.SendMessage('删除成员失败').subscribe();
          }else {
            this.msg.SendMessage('删除成员成功').subscribe();
          }
        },
        error: err => {
          this.msg.SendMessage('删除成员失败。未知错误').subscribe();
        },complete: () => {
          this.GetData();
        }
      })
      if (user.user_id === this.data.leader_id) {
        if (this.users.length === 0) {
          this.leaderID = undefined;
        } else {
          this.leaderID = this.users[0].user_id;
        }
      }
    }
  }

  // no need to handle add by input event
  addUser(e: MatChipInputEvent) {
    const input = e.input;

    if (this.filteredUsers.length === 0) {
      this.msg.SendMessage(`没有满足查询条件「${e.value}」的用户`).subscribe();
    }

    if (input) {
      input.value = '';
    }

    this.userInputControl.setValue(null);
  }

  selectUser(e: MatAutocompleteSelectedEvent) {
    const user = e.option.value as UserInfo;
    if (this.users.findIndex(u => u.user_id === user.user_id) < 0) {
      this.users.push(user);
      this.userIDs.add(user.user_id);
      const notice: Notice = {
        sender_id: this.data.leader_id,
        receiver_id: user.user_id,
        team_id: this.data.id,
        content:'邀请加入:'+ this.data.name + '团队邀请你加入',
        is_read: false,
        type: 'Message',
      };
      this.conn.PostNotice(notice).subscribe({
        next: value => {
          if ( value.status !== 0){
            this.msg.SendMessage('提交邀请失败').subscribe();
          }else{
            this.msg.SendMessage('提交邀请成功').subscribe();
          }
        },
        error: err => {
          this.msg.SendMessage('提交邀请失败。未知错误').subscribe();
        }
      });
      if (this.users.length === 0) {
        this.leaderID = user.user_id;
      }
    } else {
      this.msg.SendMessage(`用户${user.username}已存在于成员列表中`).subscribe();
    }
    this.userInput.nativeElement.value = '';
    this.userInputControl.setValue(null);
  }

  setLeader(user: UserInfo) {
    this.leaderID = user.user_id;
  }


  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              private dialog: MatDialog,
              private msg: MessageService,
              private conn: ConnectionService,) {
  }

  ngOnInit(): void {
    this.GetUserInfo();
    this.GetTrain();
    this.route.paramMap.subscribe(param => {
      this.teamId = param.get('id');
      this.editMode = (this.teamId !== 'new');
      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new team)

      // we need all trains(_ => {train_id, train_name}),
      // and all projects belongs to specific train (train_id => {train_project_id, project_name})
      this.conn.user.subscribe(user => {
        this.me = user.info;
        this.GetData();
        this.SetData();
      });
    });
  }

  createTeam(){
    const teamQ: GetTeamQ = {
      name: this.controls.name.value,
      evaluation: this.controls.evaluation.value,
      repo_url: this.controls.repo_url.value,
      team_grade: 0,
      team_master_id: this.me.user_id,
      train_id: this.controls.train_id.value,
      project_id: this.controls.project_id.value,
      avatar: this.data.avatar
    };
    console.log(teamQ);
    this.conn.CreateTeam(teamQ).subscribe({
      next: value => {
        if ( value.status !== 0){
          this.msg.SendMessage('创建队伍失败').subscribe();
        }else{
          this.msg.SendMessage('创建队伍成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('创建队伍失败。未知错误').subscribe();
      },
      complete: () => {

      }
    })
  }

  GetData(){
    if ( this.editMode ){
      if ( this.teamId === 'me' ){
        this.conn.GetTeamInfoByUserId(this.me.user_id).subscribe({
          next: value => {
            if ( value.status !== 0 ){
              this.msg.SendMessage('队伍信息获取失败').subscribe();
            }else{
              const getTeamQ: GetTeamQ = value.data as GetTeamQ;
              console.log(getTeamQ);
              const team: Team = {
                avatar: getTeamQ.avatar,
                name: getTeamQ.name,
                id: getTeamQ.id,
                train_id: getTeamQ.train_id,
                project_name: getTeamQ.project_name,
                train_name: getTeamQ.train_name,
                train_project_id: getTeamQ.project_id,
                member_count: getTeamQ.size,
                leader_id: getTeamQ.team_master_id,
                members: getTeamQ.member,
                evaluation: getTeamQ.evaluation,
                repo_url: getTeamQ.repo_url,
                team_grade: getTeamQ.team_grade,
              };
              this.data = team;
              this.users = this.data.members;
              this.GetProject(team.id);
              this.SetData();
            }
          },
          error: err => {
            this.msg.SendMessage('队伍信息获取失败。未知错误').subscribe();
          }
        });
      }else{
        this.conn.GetTeamInfo(Number(this.teamId)).subscribe({
          next: value => {
            if ( value.status !== 0 ){
              this.msg.SendMessage('队伍信息获取失败').subscribe();
            }else{
              const getTeamQ: GetTeamQ = value.data as GetTeamQ;
              const team: Team = {
                avatar: getTeamQ.avatar,
                name: getTeamQ.name,
                id: getTeamQ.id,
                train_id: getTeamQ.train_id,
                project_name: getTeamQ.project_name,
                train_name: getTeamQ.train_name,
                train_project_id: getTeamQ.project_id,
                member_count: getTeamQ.size,
                leader_id: getTeamQ.team_master_id,
                members: getTeamQ.member,
                evaluation: getTeamQ.evaluation,
                repo_url: getTeamQ.repo_url,
                team_grade: getTeamQ.team_grade,
              };
              this.data = team;
              this.users = this.data.members;
              this.GetProject(team.id);
              this.SetData();
            }
          },
          error: err => {
            this.msg.SendMessage('队伍信息获取失败。未知错误').subscribe();
          }
        });
      }
    }else{

    }
  }

  GetTrain(){
    const pageInfoQ: PageInfoQ = {
      page: 1,
      offset: 100,
    }
    this.conn.GetAllTrain(pageInfoQ).subscribe({
      next: value => {
        if (value.status !== 0){
          this.msg.SendMessage('获取实训信息失败').subscribe()
        }else{
          for (const item of value.data) {
            const trainQ: TrainQ = item as TrainQ;
            this.trains.set(trainQ.id, trainQ.name);
          }
        }
      },
      error: err1 => {
        this.msg.SendMessage('获取项目信息失败。未知错误').subscribe()
      }
    })
  }

  GetProject(id: number){
    this.conn.GetTrainProject(id).subscribe({
      next: value => {
        if (value.status !== 0){
          this.msg.SendMessage('获取项目信息失败').subscribe()
        }else{
          this.projects.clear();
          for (const item of value.data) {
            const projectQ: ProjectQ = item as ProjectQ;
            this.projects.set(projectQ.id, projectQ.name);
          }
        }
      },
      error: err1 => {
        this.msg.SendMessage('获取项目信息失败。未知错误').subscribe()
      }
    })
  }


  SetData(){
    Object.entries(this.controls).forEach(([field, control]) => {
      if(field === 'project_id'){
        control.setValue(this.data.train_project_id);
      }else{
        control.setValue(this.data[field]);
      }
    })
    this.leaderID = this.data.leader_id;

    this.projects$ = this.controls.train_id.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      map(value => this.getProjects(value))
    );

    // user input can change quite frequently, so debounce it to reduce request amount
    this.filteredUsers$ = this.userInputControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => this._filterUser(value)),
      tap(users => this.filteredUsers = users)
    )
  }

  addFile() {
    const dialogRef = this.dialog.open(SelectFileComponent, {
      data: {
        title: '上传团队文档',
        buttonHint: '选择文件',
        multiple: true
      }
    });

    dialogRef.afterClosed().subscribe((value: File[]) => {
      // TODO post selected file to backend
    })
  }

  deleteFile() {
    const files: ResourceFile[] = this.fileSelection.selectedOptions.selected.map(selection => selection.value);
    // TODO handle file delete.
  }

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  changeAvatar() {
    const dialogRef = this.dialog.open(ChangeAvatarComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const observable = result as Observable<Blob>;  // 将弹窗获得结果转换成Blob对象
        this.conn.UploadTeamAvatar(observable,this.data.id).subscribe({
          next: result => {
            this.msg.SendMessage('头像上传成功').subscribe()
          },
          error: error => {
            this.msg.SendMessage('头像上传失败').subscribe()
          },
          complete: () => {
            this.GetData();
          }
        });
      }
    });
  }

  GetUserInfo(){
    const pageInfoQ: PageInfoQ = {
      page: 1,
      offset: 100,
    }
    this.conn.GetAllUser(pageInfoQ).subscribe({
      next: value => {
        if (value.status !== 0){
          this.msg.SendMessage('获取用户信息列表失败').subscribe();
        }else{
          this.allUsers = [];
          for (const item of value.data) {
            const getUserInfo: UserInfo = item as UserInfo;
            this.allUsers.push({
              avatar: getUserInfo.avatar,
              email: getUserInfo.email,
              gender: getUserInfo.gender,
              name: getUserInfo.name,
              phone_number: getUserInfo.phone_number,
              role_name: getUserInfo.role_name,
              user_id: getUserInfo.user_id,
              introduction: getUserInfo.introduction,
              username: getUserInfo.username,
            });
          }
        }
      },
      error: err => {
        this.msg.SendMessage('获取用户信息列表失败。未知错误').subscribe();
      }
    });
  }

  saveChange() {
    const team: GetTeamQ = {
      id: this.data.id,
      name: this.controls.name.value,
      avatar: this.data.avatar,
      evaluation: this.controls.evaluation.value,
      train_id: this.controls.train_id.value,
      project_id: this.controls.project_id.value,
      repo_url: this.controls.repo_url.value,
      team_grade: this.controls.team_grade.value,
    };
    console.log(team);
    this.conn.UpdateTeamInfo(team).subscribe({
      next: value => {
        if (value.status !== 0){
          this.msg.SendMessage('修改信息失败').subscribe();
        }else{
          this.msg.SendMessage('修改信息成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('修改信息失败。未知错误').subscribe();
      },
      complete: () => {
        this.GetData();
      }
    });
  }

  getInviteLink() {
    // TODO get team invite link
    return 'not implemented'
  }
}
