import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSelectionList} from "@angular/material/list";
import {Project, ResourceFile, Team, UserInfo} from "../../types/types";
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
    }],
    resource_lib: [{
      file_name: "db7b5936-9ceb-422a-bad3-90366432a07c.jpg",
      file_path: "/api/storage/2020/7/15/db7b5936-9ceb-422a-bad3-90366432a07c.jpg",
      file_size: 584778,
      file_type: "image/jpeg",
      created: 1594798123238,
      original_name: "2019101404.jpg"
    }, {
      file_name: "21e62a42-c557-43b5-8530-b3abab4ecee8.png",
      file_path: "/api/storage/2020/7/15/21e62a42-c557-43b5-8530-b3abab4ecee8.png",
      file_size: 1845323,
      file_type: "image/png",
      created: 1594798206653,
      original_name: "2019101403.png"
    }]
  }

  trains = {
    1: 'Train1netyyhtrnnfyetn',
    2: 'Train2neytnmtrmneywm',
    3: 'Train3netynetymtyntryn',
    4: 'Train4netynetynrdtbtxgbr'
  }

  projects = {
    1: 'Project1dtnhfvnrtyytryvrncty',
    2: 'Project2tycbtynbtnerrtbvrt',
    3: 'Project3ybnyujmyumncrtydvgbrgb'
  }
  /***
   * 初始化页面信息
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userInputControl = new FormControl();
  filteredUsers$: Observable<UserInfo[]>;
  filteredUsers: UserInfo[];
  // should be sync with users
  userIDs = new Set(this.data.members.map(u => u.user_id));
  users: UserInfo[] = this.data.members;
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

  getProjects(train_id: number): [string, string][] {
    // TODO change to fetch [train_project_id, project_name] according to given train_id
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
              private msg: MessageService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new team)

      // we need all trains(_ => {train_id, train_name}),
      // and all projects belongs to specific train (train_id => {train_project_id, project_name})

      Object.entries(this.controls).forEach(([field, control]) => {
        control.setValue(this.data[field]);
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
    })
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
      // TODO change following code to edit team avatar
      // this.logger.log('The dialog was closed');
      // if (result) {
      //   const observable = result as Observable<Blob>;
      //   this.conn.UploadAvatar(observable).subscribe({
      //     next: result => {
      //       this.logger.log(result)
      //       this.msg.SendMessage('头像上传成功').subscribe()
      //     },
      //     error: error => {
      //       this.logger.log(error)
      //       this.msg.SendMessage('头像上传失败').subscribe()
      //     }
      //   });
      // }
    });
  }

  saveChange() {
    // TODO save changes
  }

  getInviteLink() {
    // TODO get team invite link
    return 'not implemented'
  }
}
