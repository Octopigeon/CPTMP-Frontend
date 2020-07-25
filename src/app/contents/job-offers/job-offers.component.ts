import { Component, OnInit } from '@angular/core';
import {JobOffer, JobOfferQ, UserInfo} from '../../types/types';
import {MatDialog} from '@angular/material/dialog';
import {ChangeAvatarComponent} from '../../popups/change-avatar/change-avatar.component';
import {OfferAddComponent} from '../../popups/offer-add/offer-add.component';
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.styl']
})
export class JobOffersComponent implements OnInit {

  admin: boolean = true;

  me: UserInfo;

  offers: JobOffer[];

  constructor(private dialog: MatDialog,
              private conn: ConnectionService,
              public msg: MessageService,) { }

  ngOnInit(): void {
    this.conn.user.subscribe(user => {
      this.me = user.info;
      this.admin = (this.me.role_name === 'ROLE_SYSTEM_ADMIN');
    });
    this.GetData();
  }


  GetData(){
    this.conn.GetAllRecruitment().subscribe({
      next: value => {
        if ( value.status !== 0 ){
          this.msg.SendMessage('获取信息失败').subscribe();
        }else {
          this.offers  = [];
          for (const item of value.data) {
            const jobOfferQ: JobOfferQ = item as JobOfferQ;
            this.offers.push({
              id: jobOfferQ.id,
              company: jobOfferQ.title,
              intro_image: jobOfferQ.photo,
              action_link: jobOfferQ.website_url
            });
          }
        }
      },
      error: err => {
        this.msg.SendMessage('获取信息失败。未知错误').subscribe();
      }
    });
  }

  deleteOffer(offer: JobOffer) {
    // TODO delete offer
    this.conn.DeleteRecruitment(offer.id).subscribe({
      next: value => {
        if ( value.status !== 0 ){
          this.msg.SendMessage('删除招聘失败').subscribe();
        }else {
          this.msg.SendMessage('删除招聘成功').subscribe();
        }
      },
      error: err => {
        this.msg.SendMessage('删除招聘失败。未知错误').subscribe();
      },
      complete: () => {
        this.GetData();
      }
    });
  }

  addOffer() {
    const dialogRef = this.dialog.open(OfferAddComponent);

    dialogRef.afterClosed().subscribe(offer => {
      // TODO POST offer
      this.conn.CreateRecruitment(offer).subscribe({
        next: value => {
          if ( value.status !== 0 ){
            this.msg.SendMessage('创建招聘失败').subscribe();
          }else {
            this.msg.SendMessage('创建招聘成功').subscribe();
          }
        },
        error: err => {
          this.msg.SendMessage('创建招聘失败。未知错误').subscribe();
        },
        complete: () => {
          this.GetData();
        }
      });
    });
  }
}
