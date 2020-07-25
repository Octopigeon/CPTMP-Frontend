import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, Notice, Role} from "../../types/types";
import {MatAccordion} from "@angular/material/expansion";
import {LocationService} from "../../services/location.service";
import {MatDialog} from "@angular/material/dialog";
import {SingleInputComponent} from "../../popups/single-input/single-input.component";
import {SendMessageComponent} from "../../popups/send-message/send-message.component";
import {ConnectionService} from "../../services/connection.service";
import {AccountEditComponent} from "../../popups/account-edit/account-edit.component";
import {LocationSignComponent} from "../../popups/location-sign/location-sign.component";
import {CameraSignComponent} from "../../popups/camera-sign/camera-sign.component";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.styl']
})
export class MessageComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  userId: number;

  messages: Message[] = [{
    title: 'message1',
    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    action: '/info/invite/1&1',
    unread: false
  }, {
    sender: {
      email: '',
      role_name: 'ROLE_SYSTEM_ADMIN',
      user_id: 1,
      name: '啊啊啊',
      username: 'USER00000001',
      avatar: '/assets/avatar.png',
    },
    title: 'message2',
    message: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊' +
      '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
    action: '/info/join/1&1',
    unread: true
  }, {
    title: 'message3',
    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    action: '/plat/chat/1',
    unread: false
  }, {
    title: 'message4',
    message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    unread: true
  }];

  markRead(message: Message) {
    message.unread = false;
    // TODO inform backend
    let notice = message.notice;
    notice.is_read = true;
    this.conn.UploadNotice(notice).subscribe();
  }

  expandAll() {
    this.accordion.openAll();
  }

  go(url: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.loc.goUrl(url);
  }

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link && (link.startsWith('http') || link.startsWith('/'));
  }

  newMessage() {
    const dialogRef = this.dialog.open(SendMessageComponent);

    // TODO post data to backend
    dialogRef.afterClosed().subscribe()
  }

  constructor(private loc: LocationService,
              private dialog: MatDialog,
              public conn: ConnectionService,) {

  }

  ngOnInit(): void {
    this.conn.user.subscribe(user => {
      this.userId = user.info.user_id;
      this.GetData();
    });
  }

  isOpenGps(message: Message): boolean{
    return (message.title === '定位签到');
  }

  isOpenFace(message: Message): boolean{
    return (message.title === '识别签到');
  }

  openGps(message: Message){
    const dialogRef = this.dialog.open(LocationSignComponent, {
      data: message
    });
    dialogRef.afterClosed().subscribe();
  }

  openFace(message: Message){
    const dialogRef = this.dialog.open(CameraSignComponent, {
      data: message
    });
    dialogRef.afterClosed().subscribe();

  }

  GetData(){
    this.conn.GetReceiverNotice(this.userId).subscribe({
      next: value => {
        const message: Message[] = [];
        for (const item of value.data) {
          const tnotice: Notice = item as Notice;
          if (tnotice.team_id !== 0){
            const str: string[] = tnotice.content.split(':' );
            switch (str[0]) {
              case '申请加入':
                const joinUrl = '/info/join/' + tnotice.sender_id + '&' + tnotice.team_id;
                message.push({
                  id: tnotice.id,
                  title: str[0],
                  message: str[1],
                  unread: !tnotice.is_read,
                  notice: tnotice,
                  action: joinUrl,
                });
                continue;
              case '邀请加入':
                const inviteUrl = '/info/invite/' + tnotice.sender_id + '&' + tnotice.team_id;
                message.push({
                  id: tnotice.id,
                  title: str[0],
                  message: str[1],
                  unread: !tnotice.is_read,
                  notice: tnotice,
                  action: inviteUrl,
                });
                continue;
              case '定位签到':
                message.push({
                  id: tnotice.id,
                  title: str[0],
                  message: str[1],
                  unread: !tnotice.is_read,
                  notice: tnotice,
                  action: null,
                });
                continue;
              case '识别签到':
                message.push({
                  id: tnotice.id,
                  title: str[0],
                  message: str[1],
                  unread: !tnotice.is_read,
                  notice: tnotice,
                  action: null,
                });
                continue;
              default:
                message.push({
                  id: tnotice.id,
                  title: str[0],
                  message: str[1],
                  unread: !tnotice.is_read,
                  notice: tnotice,
                  action: null,
                });
            }
          }
        }
        this.messages = message;
      },
      error: err => {

      }
    });
  }

}
