import {Component, OnInit} from '@angular/core';
import {EnvService} from "./services/env.service";
import {AdminNodes, masterNodes, studentNodes, teacherNodes} from "./constants/sidebar";
import {LocationService} from "./services/location.service";
import {map, shareReplay, tap} from "rxjs/operators";
import {Logger} from "./services/logger.service";
import {ConnectionService} from "./services/connection.service";
import {NavigationService} from "./services/navigation.service";
import {NavigationNode} from "./types/nav.model";
import {of, ReplaySubject, Subject} from "rxjs";
import {AccountBulkAddComponent} from "./popups/account-bulk-add/account-bulk-add.component";
import {MatDialog} from "@angular/material/dialog";
import {BotChatComponent} from "./popups/bot-chat/bot-chat.component";
import {Notice, UserInfo} from "./types/types";

@Component({
  selector: 'cptmp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'CPTMP';
  isFetching = false;

  // start page has different style and elements
  isStartPage = this.loc.url$.pipe(
    tap(path => this.logger.log('got path ' + path)),
    map(path => !path.startsWith('/plat')),
  );

  windowType = this.env.size$;
  sideNavNodes$ = new ReplaySubject<NavigationNode[]>(1);

  message: number;

  messageCount$ = of(0).pipe(shareReplay(1));

  me: UserInfo

  constructor(private env: EnvService,
              private loc: LocationService,
              private logger: Logger,
              public conn: ConnectionService,
              public nav: NavigationService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.sideNavNodes$.subscribe(nodes => this.nav.updateNavigationView(nodes))
    // TODO change according to user type



    this.conn.user.subscribe(user => {
      if (!user.login) {
        return;
      }

      this.me = user.info;

      switch ( this.me.role_name){
        case 'ROLE_SYSTEM_ADMIN':
          this.sideNavNodes$.next(AdminNodes);
          break;
        case 'ROLE_ENTERPRISE_ADMIN':
          this.sideNavNodes$.next(masterNodes);
          break;
        case 'ROLE_SCHOOL_ADMIN':
          this.sideNavNodes$.next(masterNodes);
          break;
        case 'ROLE_SCHOOL_TEACHER':
          this.sideNavNodes$.next(teacherNodes);
          break;
        case 'ROLE_STUDENT_MEMBER':
          this.sideNavNodes$.next(studentNodes);
          break;
      }
      this.conn.GetReceiverNotice(this.me.user_id).subscribe({
        next: value => {
          this.message = 0;
          for (const item of value.data) {
            const tnotice: Notice = item as Notice;
            if(!tnotice.is_read) this.message++;
          }
          this.messageCount$ = of(this.message).pipe(shareReplay(1));
        }
      })
    });

  }

  openChatBot(){
    const dialogRef = this.dialog.open(BotChatComponent);
  }

}
