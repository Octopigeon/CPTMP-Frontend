import {Injectable, OnInit} from '@angular/core';
import {StorageMap} from "@ngx-pwa/local-storage";
import {HttpClient} from "@angular/common/http";
import {LoginP, LoginQ, UserInfoL} from "../types/types";
import {UserInfoS} from "../types/schema";
import {environment} from "../../environments/environment";
import {Logger} from "./logger.service";
import {Observable, Subscriber} from "rxjs";
import {LoginU} from "../types/api";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService implements OnInit {

  private user: UserInfoL = {login: false};

  constructor(
    private storage: StorageMap,
    private client: HttpClient,
    private logger: Logger,
  ) { }

  ngOnInit(): void {
    this.storage.get<UserInfoL>('user', UserInfoS).subscribe(user => {
      if (typeof user === 'undefined') {
        this.storage.set('user', {login: false}, (!environment.production) ? UserInfoS : undefined).subscribe()
        this.user = {login: false}
        this.logger.log('User info not found in storage. Set with default.')
        return;
      }
      this.user = user
      this.logger.log(`Load User info: ${user}`)
    });
  }

  private failed<T>(err?: any): Observable<T> {
    return new Observable((observer: Subscriber<T>) => observer.error(err));
  }

  public Login(loginInfo: LoginQ): Observable<LoginP> {
    if (!loginInfo.username || !loginInfo.password) {
      return this.failed<LoginP>('Login field missing.');
    }
    this.client.get(LoginU, )
  }
}
