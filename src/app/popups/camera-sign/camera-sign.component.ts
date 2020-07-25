import {Component, Inject, OnInit} from '@angular/core';
import {Observable, of, Subject, Subscriber} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';
import {delay} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Message, Team, UserInfo} from "../../types/types";
import {ConnectionService} from "../../services/connection.service";
import {fromPromise} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-camera-sign',
  templateUrl: './camera-sign.component.html',
  styleUrls: ['./camera-sign.component.styl'],
  animations: [
    trigger('hint', [
      transition(':enter', [
        style({ opacity: 0}),  // initial
        animate('0.3s ease-out',
          style({ opacity: 1}))  // final
      ]),
      transition(':leave', [
        style({ opacity: 1}),
        animate('0.3s ease-out',
          style({ opacity: 0}))
      ])
    ])
  ]
})
export class CameraSignComponent implements OnInit {

  // are we collecting user photo, or doing signing?
  signMode: boolean = true;

  trigger: Observable<void>;
  captureRequestSubscriber: Subscriber<void>;
  switchCamera = new Subject<boolean|string>();
  finished: boolean = false;
  processing: boolean = false;
  errored: boolean = false;
  failed: boolean = false;

  constructor(public dialogRef: MatDialogRef<CameraSignComponent>,
              private conn: ConnectionService,
              @Inject(MAT_DIALOG_DATA) public data?: Message,) {
    // TODO change to real data type, and do inits (set signMode)
  }

  me: UserInfo;

  team: Team;


  ngOnInit(): void {
    this.trigger = new Observable(subscriber =>this.captureRequestSubscriber = subscriber);
    this.conn.user.subscribe(user => {
      this.me = user.info;
      this.conn.GetTeamInfoByUserId(this.me.user_id).subscribe(value => {
        this.team = value.data as Team;
      });
    });
    if ( this.data !== null){
      this.signMode = true;
    }else{
      this.signMode = false;
    }
  }

  cancelClose() {
    this.dialogRef.close(false);
  }

  doneClose() {
    this.dialogRef.close(true);
  }

  takeShot() {
    this.processing = true;
    this.captureRequestSubscriber.next();
  }

  processShot(image: WebcamImage) {
    fromPromise(fetch(image.imageAsDataUrl).then(resp => resp.blob())).subscribe(blob => {
      const file: File = blob as File;
      console.log(file);
      if ( this.signMode ){
        this.conn.FaceSignin(this.me.user_id, this.team.id, this.team.train_id, file).subscribe({
          next: value => {
            this.processing = false;
            this.finished = true;
          },
          error: err => {
            this.processing = false;
            this.failed = true;
          }
        });
      }else {
        this.conn.UploadFaceInfo(this.me.user_id, file).subscribe({
          next: value => {
            this.processing = false;
            this.finished = true;
          },
          error: err => {
            this.processing = false;
            this.failed = true;
          }
        })
      }
    })
  }
}
