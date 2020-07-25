import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CameraSignComponent} from '../../popups/camera-sign/camera-sign.component';
import {LocationSignComponent} from '../../popups/location-sign/location-sign.component';
import {BotChatComponent} from '../../popups/bot-chat/bot-chat.component';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.styl']
})
export class EmptyComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  click() {
    this.dialog.open(LocationSignComponent).afterClosed().subscribe()
  }

  ngOnInit(): void {
  }

}
