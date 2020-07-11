import {Injectable, OnInit} from '@angular/core';
import {StorageMap} from "@ngx-pwa/local-storage";
import {HttpClient} from "@angular/common/http";
import {LoginQ, Resp, UserInfo, UserInfoL} from "../types/types";
import {Logger} from "./logger.service";
import {Observable, Subscriber} from "rxjs";
import {API} from "../types/api";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private _user: UserInfoL = {login: false};
  public get user() { return this._user; };

  constructor(
    private storage: StorageMap,
    private client: HttpClient,
    private logger: Logger,
  ) {}

  public loadInfo(): Observable<boolean> {
    let subscribe: Subscriber<boolean>;
    const o = new Observable<boolean>(s => subscribe = s);
    this.storage.get('user').subscribe(u => {
      const user = u as UserInfoL;
      if (typeof user === 'undefined') {
        this.storage.set('user', {login: false}).subscribe()
        this._user = {login: false}
        subscribe.next(false);
        this.logger.log('User info not found in storage. Set with default.')
        return;
      }
      this._user = user
      subscribe.next(true);
      this.logger.log(`Load User info: ${user}`)
    });
    return o;
  }

  private failed<T>(err?: any): Observable<T> {
    return new Observable((observer: Subscriber<T>) => observer.error(err));
  }

  private get(url: string): Observable<Resp> {
    return this.client.get<Resp>(url);
  }

  private post(url: string, body: any): Observable<Resp> {
    return this.client.post<Resp>(url, body);
  }

  public Login(loginInfo: LoginQ): Observable<UserInfo> {
    if (!loginInfo.username || !loginInfo.password) {
      return this.failed<UserInfo>({
        msg: "Missing field."
      });
    }

    let observer: Subscriber<UserInfo>;
    const result = new Observable<UserInfo>((o: Subscriber<UserInfo>) => observer = o);

    this.post(API.login, loginInfo).subscribe({
      next: response => {
        /* Possible error codes are:
         * 0 => OK
         * 1 => Bad Account / Password
         * 5 => Account locked
         * 7 => Unknown
         */
        if (response.status !== 0) {
          this.logger.log(`Login failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return;
        }
        this.logger.log('Login successful.');
        this.GetUserInfo().subscribe({
          next: info => observer.next(info),
          error: error => observer.error(error)
        })
      },
      error: error => {
        this.logger.log(`Login failed with network error: ${error}.`);
        observer.error(error)
      }
    })

    return result;
  }

  public GetUserInfo(): Observable<UserInfo> {
    let observer: Subscriber<UserInfo>;
    const result = new Observable<UserInfo>((o: Subscriber<UserInfo>) => observer = o);

    this.get(API.user_info).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get user info failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return;
        }
        const info = response.data as UserInfo;
        this.storage.set('user', {login: true, info}).subscribe()
        this._user = {login: true, info}
        observer.next(info);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get user info failed with network error: ${error}.`);
        observer.error(error)
      }
    })

    return result;
  }
}
