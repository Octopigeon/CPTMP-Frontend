import {Component, Inject, OnInit} from '@angular/core';
import {Observable, of, Subject, Subscriber} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';
import {delay} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Message} from "../../types/types";

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
              @Inject(MAT_DIALOG_DATA) public data?: Message) {
    // TODO change to real data type, and do inits (set signMode)
  }

  ngOnInit(): void {
    this.trigger = new Observable(subscriber =>this.captureRequestSubscriber = subscriber);
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
    // TODO post image to backend and process result
    of(false).pipe(delay(1000)).subscribe(result => {
      this.processing = false;
      if (result) {
        this.finished = true;
      } else {
        this.failed = true;
        setTimeout(() => {
          this.failed = false;
        }, 2000)
      }
    })
  }
}
