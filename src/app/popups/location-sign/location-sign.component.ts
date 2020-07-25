import {Component, Inject, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GpsInfo, Message, Team} from "../../types/types";
import {ConnectionService} from "../../services/connection.service";

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

  team: Team;

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loading = false;
          this.sending = true;
          this.reportLocation(this.cloneCoordinates(position.coords));
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

  // convert property getter/setters to plain properties
  cloneCoordinates(loc: Coordinates) {
    return {
      accuracy: loc.accuracy,
      altitude: loc.altitude,
      altitudeAccuracy: loc.altitudeAccuracy,
      heading: loc.heading,
      latitude: loc.latitude,
      longitude: loc.longitude,
      speed: loc.speed,
    }
  }

  retry() {
    this.wait *= 2;
    this.loading = true;
    this.timeout = false;
    this.detectLocation();
  }

  reportLocation(loc: Coordinates) {
    // TODO report to backend
    const data = JSON.stringify(loc);
    console.log(data);
    const gps: GpsInfo = {
      user_id: this.data.notice.receiver_id,
      team_id: this.team.id,
      train_id: this.team.train_id,
      longitude: loc.longitude,
      latitude: loc.latitude,
    }
    this.conn.GpsSignin(gps).subscribe({
      next: value => {
        this.sending = false;
        if(value.msg === 'sign in successfully'){
          this.finished = true;
        }else {
          this.failed = true;
        }
      },
      error: err => {
        this.failed = true;
      }
    });
  }

  constructor(public dialogRef: MatDialogRef<LocationSignComponent>,
              private conn: ConnectionService,
              @Inject(MAT_DIALOG_DATA) public data?: Message,) { }

  ngOnInit(): void {

    this.conn.GetTeamInfoByUserId(this.data.notice.receiver_id).subscribe(value => {
      this.team = value.data as Team;
      this.detectLocation();
    });
  }

  cancelClose() {
    this.dialogRef.close(false);
  }

  doneClose() {
    this.dialogRef.close(true);
  }
}
