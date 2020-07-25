import {Component, Inject, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Message} from "../../types/types";

@Component({
  selector: 'app-location-sign',
  templateUrl: './location-sign.component.html',
  styleUrls: ['./location-sign.component.styl']
})
export class LocationSignComponent implements OnInit {
  loading: boolean = true;
  finished: boolean = false;
  errored: boolean = false;
  timeout: boolean = false;
  sending: boolean = false;
  failed: boolean = false;
  wait: number = 10000;

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loading = false;
          this.sending = true;
          this.reportLocation(position.coords);
        },
        (error) => {
          this.loading = false;
          if (error.code === error.TIMEOUT) {
            this.timeout = true;
          } else {
            this.errored = true;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: this.wait,
        })
    } else {
      this.errored = true;
    }
  }

  retry() {
    this.wait *= 2;
    this.detectLocation();
  }

  reportLocation(loc: Coordinates) {
    // TODO report to backend
    const data = JSON.stringify(loc);
    console.log(data);
    of(true).pipe(delay(10000)).subscribe(result => {
      this.sending = false;
      if (result) {
        this.finished = true;
      } else {
        this.failed = true;
      }
    })
  }

  constructor(public dialogRef: MatDialogRef<LocationSignComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: Message) { }

  ngOnInit(): void {
    this.detectLocation();
  }

  cancelClose() {
    this.dialogRef.close(false);
  }

  doneClose() {
    this.dialogRef.close(true);
  }
}
