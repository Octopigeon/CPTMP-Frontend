import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatMessage} from '../../types/types';

const EXAMPLE_CHAT: ChatMessage[] = [{
  name: 'Chatbot',
  message: "Hi, there's chatbot. What can I help you?"
}, {
  name: 'TY',
  message: "Cool!",
  self: true,
}, {
  name: 'Chatbot',
  message: "My pleasure. Have you experienced some problem?"
}, {
  name: 'TY',
  message: "It's fine,",
  self: true,
}, {
  name: 'TY',
  message: "But I can't find where to create a team.",
  self: true,
}, {
  name: 'Chatbot',
  message: "OK. Seems you are already in a train."
}, {
  name: 'Chatbot',
  message: "You can go to Project List, there you can check all projects and pick what you are interested in. " +
    "There should also be a button to take you to team create page."
}]

// TODO where to use me?
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.styl']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatList', {static: true}) chatList: ElementRef<HTMLElement>;

  chat: ChatMessage[] = EXAMPLE_CHAT;

  userInput: string = '';
  chatListDirty: boolean = true;

  pushMessage() {
    if (!this.userInput) {
      return;
    }

    this.chat.push({
      name: 'TY',
      message: this.userInput,
      self: true
    })
    this.userInput = '';
    this.chatListDirty = true;
  }

  adjustScroll() {
    if (!this.chatListDirty) {
      return;
    }

    const chat = this.chatList.nativeElement;
    const scroll = chat.scrollHeight - chat.clientHeight;

    if (scroll > 0) {
      chat.scrollTop = scroll;
    }

    this.chatListDirty = false;
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.adjustScroll()
  }

}

