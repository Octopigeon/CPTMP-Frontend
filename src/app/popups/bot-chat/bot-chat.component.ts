import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {JsLoaderService} from '../../services/js-loader.service';
import {HttpClient} from '@angular/common/http';
import {ConnectionService} from '../../services/connection.service';
import {environment} from '../../../environments/environment';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-bot-chat',
  templateUrl: './bot-chat.component.html',
  styleUrls: ['./bot-chat.component.styl'],
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
export class BotChatComponent implements OnInit {

  // @ViewChild('botContainer') botContainer: ElementRef<HTMLElement>;
  //
  loading: boolean = true;
  // error: boolean = false;

  botLoaded() {
    this.loading = false;
  }

  constructor(private loader: JsLoaderService, private client: HttpClient, private conn: ConnectionService) {
    // this.loader.load('web_chat').subscribe({
    //   next: () => {
    //     this.loading = false;
    //     this.conn.user.subscribe(user => {
    //       this.client.post('https://directline.botframework.com/v3/directline/tokens/generate',
    //         {user: `dl_${user.info? user.info.username : 'guest'}_${Math.random()}`},
    //         {headers: {
    //           Authorization: `Bearer ${environment.chat_bot_key}`
    //           }}
    //       ).subscribe({
    //         next: (resp: {conservationId: string, token: string, expires_in: number}) => {
    //           // @ts-ignore
    //           window.WebChat.createDirectLineAppServiceExtension({
    //             domain: 'https://cptmpbot-dev.azurewebsites.net/.bot/v3/directline',
    //             token: resp.token
    //           }).then(directLine => {
    //             // @ts-ignore
    //             window.WebChat.renderWebChat({directLine}, this.botContainer.nativeElement);
    //           }).catch(_ => {
    //             this.error = true;
    //           })
    //         },
    //         error: _ => this.error = true
    //       })
    //     })
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.error = true;
    //   }
    // })
  }

  ngOnInit(): void {
  }

}
