import {Injectable, OnInit} from '@angular/core';
import {StorageMap} from "@ngx-pwa/local-storage";

import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {
  ChangePasswordQ,
  ModifyUserBasicInfoQ,
  CreateOrgQ,
  LoginQ,
  Resp,
  UserInfo,
  UserInfoL,
  DeleteUserQ,
  PageResp, PageInfoQ, TrainQ, CreateTrainQ
} from "../types/types";

import {Logger} from "./logger.service";
import {Observable, ReplaySubject, Subscriber} from "rxjs";
import {API} from "../constants/api";
import {LocationService} from "./location.service";
import {distinctUntilChanged, map} from "rxjs/operators";
import {PrettyStacktraceProcessor} from "jasmine-spec-reporter/built/processors/pretty-stacktrace-processor";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private _user: UserInfoL = {login: false};
  public user: ReplaySubject<UserInfoL>;
  public avatar: ReplaySubject<string>;

  constructor(
    private storage: StorageMap,
    private client: HttpClient,
    private logger: Logger,
    private loc: LocationService,
  ) {
    this.user = new ReplaySubject<UserInfoL>(1);
    this.loadInfo()
    this.GetUserInfo().subscribe()
    this.avatar = new ReplaySubject<string>(1);
    this.user.pipe(
      map(info => (!info.login ||
        !info.info.avatar ||
        (!info.info.avatar.startsWith('http') && !info.info.avatar.startsWith('/')))
        ? '/assets/avatar.png' : info.info.avatar),
      distinctUntilChanged()
    ).subscribe(link => this.avatar.next(link));
  }

  // Load UserInfo from IndexedDB to boost page loading.
  public loadInfo() {
    this.storage.get('user').subscribe(u => {
      const user = u as UserInfoL;
      if (typeof user === 'undefined') {
        this.storage.set('user', {login: false}).subscribe()
        this._user = {login: false}
        this.user.next(this._user);
        this.logger.log('User info not found in storage. Set with default.')
        return;
      }
      this._user = user
      this.user.next(this._user);
      this.logger.log(`Load User info: ${user}`)
    });
  }

  private failed<T>(err?: any): Observable<T> {
    return new Observable((observer: Subscriber<T>) => observer.error(err));
  }

  private delete(url: string, ibody?: any): Observable<Resp> {
    if (ibody == null) {
      return this.client.delete<Resp>(url);
    } else {
      return this.client.request<Resp>('delete', url, {body: ibody});
    }
  }

  private get(url: string): Observable<Resp> {
    return this.client.get<Resp>(url);
  }

  private getMore(url: string): Observable<PageResp> {
    return this.client.get<PageResp>(url);
  }

  private post(url: string, body: any): Observable<Resp> {
    return this.client.post<Resp>(url, body);
  }


  private put(url: string, body: any): Observable<Resp> {
    return this.client.put<Resp>(url, body);
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
        this.logger.log(`Login failed with network error: `, error);
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
          this._user = {login: false}
          this.storage.set('user', {login: false}).subscribe()
          this.user.next(this._user);

          // take user to login page when user is not login
          if (this.loc.url.startsWith('/plat')) {
            this.loc.go(['/'])
          }
          return;
        }
        const info = response.data as UserInfo;
        this.storage.set('user', {login: true, info}).subscribe()
        this._user = {login: true, info}
        this.user.next(this._user);
        observer.next(info);
        observer.complete();
        if (!this.loc.url.startsWith('/plat')) {
          // take user to panel when user has login
          // TODO change to status panel in the future
          this.loc.go(['/', 'plat', 'user', 'me'])
        }
      },
      error: error => {
        this.logger.log(`Get user info failed with network error: `, error);
        observer.error(error)
      }
    })

    return result;
  }

  public ChangePassword(changeRequest: ChangePasswordQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.put(API.change_password, changeRequest).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Change password failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Change password failed with network error: `, error);
        observer.error(error)
      }
    })

    return result;
  }

  public UploadUserBasicData(basicDate: ModifyUserBasicInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.put(API.user_info, basicDate).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload User Basic Data failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Upload User Basic Data failed with network error: `, error);
        observer.error(error)
      }
    })

    return result;
  }

  public UploadAvatar(avatar: Observable<Blob>): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    avatar.subscribe(blob => {
      let formData = new FormData();
      formData.append('file', blob, 'avatar.png');
      this.put(API.upload_avatar, formData).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Upload avatar failed with status code ${response.status}: ${response.msg}.`)
            observer.error(response);
            return;
          }
          observer.next(response);
          observer.complete();

          // refresh user info when succeed.
          const info = response.data as UserInfo;
          this.storage.set('user', {login: true, info}).subscribe()
          this._user = {login: true, info}
          this.user.next(this._user);
        },
        error: error => {
          this.logger.log(`Upload avatar failed with network error: `, error);
          observer.error(error)
        }
      })
    })

    return result;
  }

  public UploadTrainFile(trainId: number, file: File): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    let formData = new FormData();
    formData.append('file', file, file.name);
    const url = API.train + '/' + trainId + '/resource-lib'
    this.post(url, formData).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload avatar failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Upload avatar failed with network error: `, error);
        observer.error(error)
      }
    })
    return result;
  }

  public CreateOrganization(org: CreateOrgQ[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.post(API.org, org).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Create Organization failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Create Organization failed with network error: `, error);
        observer.error(error);
      }
    });

    return result;
  }

  public UploadOrgBasicInfo(org: CreateOrgQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.post(API.org_basic_info, org).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload organization basic information failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Upload organization basic information failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public DeleteUser(deleteUserQ: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.delete(API.delete_user, deleteUserQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Delete User failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Delete User failed with network error: `, error);
        observer.error(error)
      }
    })
    return result;
  }

  public DeleteProject(deleteProjectQ: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.delete(API.delete_project, deleteProjectQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Delete Project failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Delete Project failed with network error: `, error);
        observer.error(error)
      }
    })
    return result;
  }

  public GetOrgInfo(orgId: number): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.org + '/' + orgId
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get org info failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get org info all train failed with network error: `, error);
        observer.error(error)
      }
    })
    return result;
  }

  public GetAllTrain(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train + '/?offset=' + pageInfoQ.offset + '&page=' + pageInfoQ.page
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all train failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all train failed with network error: `, error);
        observer.error(error)
      }
    })
    return result
  }

  public DeleteTrain(trainId: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const errorList: number[] = [];
    let length = trainId.length;
    for (const storageElement of trainId) {
      const url = API.train + '/' + storageElement
      this.delete(url).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Delete train failed with status code ${response.status}: ${response.msg}.`)
            errorList.push(storageElement)
          }
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '实训';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage)
            } else {
              console.log(errorList.length)
              observer.next()
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        },
        error: error => {
          this.logger.log(`Delete train failed with network error: `, error);
          errorList.push(storageElement)
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '实训';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage)
            } else {
              console.log(errorList.length)
              observer.next()
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        }
      })
    }
    return result
  }

  public GetTrain(trainId: string): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train + '/' + trainId
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get train failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get train failed with network error: `, error);
        observer.error(error)
      }
    })
    return result
  }

  public UpdateTrain(trainQ: TrainQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    return result
  }

  public CreateTrain(trainQ: CreateTrainQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.post(API.train, trainQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Create train failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Create train failed with network error: `, error);
        observer.error(error);
      }
    })
    return result
  }

  public GetAllOrg(pageInfoQ: PageInfoQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.org + '?page=' + pageInfoQ.page + '&offset=' + pageInfoQ.offset
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all org info failed with status code ${response.status}: ${response.msg}.`)
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all org info failed with network error: `, error);
        observer.error(error)
      }
    })
    return result
  }

}
