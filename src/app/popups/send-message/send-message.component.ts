import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Organization, PageInfoQ, UserInfo} from "../../types/types";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, tap} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";

const ALL_USERS: UserInfo[] = [{
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

const ALL_ORGANIZATIONS = [{
  name: 'school1',
  id: 1
}, {
  name: 'school2',
  id: 2
}, {
  name: 'school3',
  id: 3
}, {
  name: 'school4',
  id: 4
}, ]

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.styl'],
  animations: [
    trigger('display', [
      state('hide', style({height: '0px', minHeight: '0', opacity: '0', visibility: 'hidden', marginTop: '0', marginBottom: '0'})),
      state('show', style({height: '*', opacity: '1', visibility: 'visible', marginTop: '*', marginBottom: '*'})),
      transition('hide <=> show', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SendMessageComponent implements OnInit {

  scopes = [
    {name: '系统 - 此系统中的所有用户', value: 'SYSTEM', level: 5},
    {name: '企业 - 所有企业用户', value: 'ENTERPRISE', level: 4},
    {name: '教师 - 学校所有教师', value: 'TEACHER', level: 3},
    {name: '学生 - 学校所有学生', value: 'STUDENT', level: 2},
    {name: '团队 - 你作为组长的小组', value: 'TEAM', level: 1},
  ]

  // 0: common student
  // 1: team leader
  // 2: teacher
  // 3: school admin
  // 4: enterprise admin
  // 5: system admin
  permissionLevel: number = 5;

  messageForm = new FormGroup({
    broadcast: new FormControl(false),
    scope: new FormControl(''),
    organization: new FormControl(),
    target: new FormControl(),
    title: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    action: new FormControl('')
  })

  // message target user id
  target_id: number;

  // message target organization id
  organization_id: number;

  filteredUsers$: Observable<UserInfo[]>;
  filteredUsers: UserInfo[];

  // TODO change to real type
  filteredOrganizations$: Observable<{name: string, id: number}[]>;
  filteredOrganizations: {name: string, id: number}[];

  showOrganizationPicker() {
    console.log(this.messageForm.controls.broadcast.value,
      this.permissionLevel,
      this.messageForm.controls.scope.value)
    return this.messageForm.controls.broadcast.value && this.permissionLevel > 3 &&
      (this.messageForm.controls.scope.value === "TEACHER" || this.messageForm.controls.scope.value === "STUDENT");
  }

  cancelClose() {
    this.dialogRef.close();
  }

  // TODO return message info from form
  getMessage(){
    // const org: Organization = {
    //   name: this.schoolForm.value.name,
    //   code: this.schoolForm.value.code,
    //   url: this.schoolForm.value.url,
    //   description: this.schoolForm.value.description
    // };
    // this.dialogRef.close(org);
  }

  constructor(public dialogRef: MatDialogRef<SendMessageComponent>,
              private conn: ConnectionService,
              private msg: MessageService,
              @Inject(MAT_DIALOG_DATA) public data: Organization) {


    // user input can change quite frequently, so debounce it to reduce request amount
    this.filteredOrganizations$ = this.messageForm.controls.organization.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => this._filterSchool(value)),
      tap(users => this.filteredOrganizations = users)
    )

    this.filteredUsers$ = this.messageForm.controls.target.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => this._filterUser(value)),
      tap(users => this.filteredUsers = users)
    )
  }

  private _filterUser(value: string): UserInfo[] {
    // TODO change to real fetch (with entry count limit and permission check)
    if (!value) {
      return [];
    }

    const filterValue = value.toLowerCase()
    return ALL_USERS.filter(user => (user.name.toLowerCase().includes(filterValue) ||
      user.username.toLowerCase().includes(filterValue)) &&
      user.user_id !== this.messageForm.controls.target.value.user_id);
  }

  private _filterSchool(value: string): {name: string, id: number}[] {
    // TODO change to real fetch (with entry count limit)
    if (!value) {
      return ALL_ORGANIZATIONS;
    }

    const filterValue = value.toLowerCase()
    return ALL_ORGANIZATIONS.filter(organization => (organization.name.toLowerCase().includes(filterValue) &&
      organization.id !== this.messageForm.controls.organization.value.id));
  }

  displayUser(user: UserInfo): string {
    return user && user.name ? user.name : '';
  }

  displayOrganization(org: {name: string, id: number}): string {
    return org && org.name ? org.name : '';
  }

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link && (link.startsWith('http') || link.startsWith('/'));
  }

  ngOnInit(): void {

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
          this.filteredUsers = [];
          for (const item of value.data) {
            const getUserInfo: UserInfo = item as UserInfo;
            this.filteredUsers.push({
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
}
