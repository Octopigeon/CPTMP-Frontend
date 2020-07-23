import {Component, Input, OnInit, Output} from '@angular/core';
import {ChatMessage} from '../../types/types';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.styl']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: ChatMessage = {
    name: 'Me',
    message: '',
    self: false,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
