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
  PageResp, PageInfoQ, TrainQ, CreateTrainQ, PostRegisterQ, ChangPwdByForce, Train, ProjectQ, GetTeamQ
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
    this.loadInfo();
    this.GetUserInfo().subscribe();
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
        this.storage.set('user', {login: false}).subscribe();
        this._user = {login: false};
        this.user.next(this._user);
        this.logger.log('User info not found in storage. Set with default.');
        return;
      }
      this._user = user;
      this.user.next(this._user);
      this.logger.log(`Load User info: ${user}`);
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

  private get(url: string, ibody?: any): Observable<Resp> {
    if (ibody == null){
      return this.client.get<Resp>(url);
    }else{
      console.log(ibody)
      return this.client.request<Resp>('get', url, {body: ibody});
    }
  }

  private post(url: string, body: any): Observable<Resp> {
    return this.client.post<Resp>(url, body);
  }


  private put(url: string, body: any): Observable<Resp> {
    return this.client.put<Resp>(url, body);
  }

  /**
   * 登陆连接
   * @param loginInfo 登陆的用户信息
   * @constructor
   */
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
        });
      },
      error: error => {
        this.logger.log(`Login failed with network error: `, error);
        observer.error(error);
      }
    });

    return result;
  }

  /***
   * 获取用户信息的连接
   * @constructor
   */
  public GetUserInfo(): Observable<UserInfo> {
    let observer: Subscriber<UserInfo>;
    const result = new Observable<UserInfo>((o: Subscriber<UserInfo>) => observer = o);

    this.get(API.user_info).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get user info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          this._user = {login: false};
          this.storage.set('user', {login: false}).subscribe()
          this.user.next(this._user);

          // take user to login page when user is not login
          if (this.loc.url.startsWith('/plat')) {
            this.loc.go(['/']);
          }
          return;
        }
        const info = response.data as UserInfo;
        this.storage.set('user', {login: true, info}).subscribe();
        this._user = {login: true, info};
        this.user.next(this._user);
        observer.next(info);
        observer.complete();
        if (!this.loc.url.startsWith('/plat') && !this.loc.url.startsWith('/info')) {
          // take user to panel when user has login
          // TODO change to status panel in the future
          this.loc.go(['/', 'plat', 'user', 'me'])
        }
      },
      error: error => {
        this.logger.log(`Get user info failed with network error: `, error);
        observer.error(error);
      }
    });

    return result;
  }


  /***
   * 修改密码的连接
   * @param changeRequest  修改密码的信息体
   * @constructor
   */
  public ChangePassword(changeRequest: ChangePasswordQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.put(API.change_password, changeRequest).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Change password failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Change password failed with network error: `, error);
        observer.error(error);
      }
    });

    return result;
  }

  /***
   * 修改用户基本信息的连接
   * @param basicDate  用户基本信息
   * @constructor
   */
  public UploadUserBasicData(basicDate: ModifyUserBasicInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.put(API.user_info, basicDate).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload User Basic Data failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Upload User Basic Data failed with network error: `, error);
        observer.error(error);
      }
    });

    return result;
  }

  /***
   * 修改用户头像的连接
   * @param avatar  用户头像对象
   * @constructor
   */
  public UploadAvatar(avatar: Observable<Blob>): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    avatar.subscribe(blob => {
      let formData = new FormData();
      formData.append('file', blob, 'avatar.png');
      this.put(API.upload_avatar, formData).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Upload avatar failed with status code ${response.status}: ${response.msg}.`);
            observer.error(response);
            return;
          }
          observer.next(response);
          observer.complete();

          // refresh user info when succeed.
          const info = response.data as UserInfo;
          this.storage.set('user', {login: true, info}).subscribe();
          this._user = {login: true, info};
          this.user.next(this._user);
        },
        error: error => {
          this.logger.log(`Upload avatar failed with network error: `, error);
          observer.error(error);
        }
      });
    });

    return result;
  }

  /***
   * 上传实训材料的连接
   * @param trainId  对应实训的ID
   * @param file  文件对象
   * @constructor
   */
  public UploadTrainFile(trainId: number, file: File): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    let formData = new FormData();
    formData.append('file', file, file.name);
    const url = API.train + '/' + trainId + '/resource-lib';
    this.post(url, formData).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload avatar failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Upload avatar failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 创建组织的连接
   * @param org  组织信息
   * @constructor
   */
  public CreateOrganization(org: CreateOrgQ[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.post(API.org, org).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Create Organization failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          setTimeout(() => {
            observer.complete();
          }, 1000);
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

  /***
   * 修改组织基本信息的连接
   * @param org 组织信息
   * @constructor
   */
  public UploadOrgBasicInfo(org: CreateOrgQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.post(API.org_basic_info, org).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload organization basic information failed with status code ${response.status}: ${response.msg}.`);
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

  public DeleteTeam(teamId: number[]): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    const errorList: number[] = [];
    let length = teamId.length;
    for (const storageElement of teamId) {
      const url = API.team + '/' + storageElement;
      this.delete(url).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Delete team failed with status code ${response.status}: ${response.msg}.`);
            errorList.push(storageElement);
          }
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '团队';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        },
        error: error => {
          this.logger.log(`Delete team failed with network error: `, error);
          errorList.push(storageElement);
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '实训';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        }
      });
    }
    return result;
  }

  public DeleteOrg(orgId: number[]): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const errorList: number[] = [];
    let length = orgId.length;
    for (const storageElement of orgId) {
      const url = API.org + '/' + storageElement;
      console.log(url);
      this.delete(url).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Delete org failed with status code ${response.status}: ${response.msg}.`);
            errorList.push(storageElement);
          }
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '组织';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 500);
            }
          }
        },
        error: error => {
          this.logger.log(`Delete org failed with network error: `, error);
          errorList.push(storageElement);
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '组织';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        }
      });
    }
    return result;
  }

  public UploadTrainInfo(trainQ: TrainQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.put(API.train, trainQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Upload train info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
        }else{
          observer.next(response);
          setTimeout(() => {
            observer.complete();
          }, 500);
        }
      },
      error: error => {
        this.logger.log(`Upload train info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 删除用户的连接
   * @param deleteUserQ  删除用的的id数组
   * @constructor
   */
  public DeleteUser(deleteUserQ: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    this.delete(API.user, deleteUserQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Delete User failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
        }else{
          observer.next(response);
          setTimeout(() => {
            observer.complete();
          }, 500);
        }
      },
      error: error => {

        this.logger.log(`Delete User failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 删除项目的连接
   * @param deleteProjectQ  删除项目的ID数组
   * @constructor
   */
  public DeleteProject(deleteProjectQ: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.delete(API.train_project, deleteProjectQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Delete Project failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
        }else{
          observer.next(response);
          setTimeout(() => {
            observer.complete();
          }, 500);
        }
      },
      error: error => {
        this.logger.log(`Delete Project failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 获取对应组织信息的连接
   * @param orgId  对应组织的ID
   * @constructor
   */
  public GetOrgInfo(orgId: number): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.org + '/' + orgId;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get org info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get org info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetOrgInfoByGroup(orgId: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    let url = API.org + '/name?org_id=' + orgId[0] ;
    for ( let i = 1; i < orgId.length; i++){
      url = url + ',' + orgId[i];
    }
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get org info by group failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get org info by group failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public UpdateUserInfoByForce(modifyUserBasicInfoQ: ModifyUserBasicInfoQ , userId: number): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.user + '/' + userId + '/basic-info'
    console.log(url)
    this.put(url, modifyUserBasicInfoQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Update user info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
        }else{
          observer.next(response);
          setTimeout(() => {
            observer.complete();
          }, 500);
        }
      },
      error: error => {
        this.logger.log(`Update user info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 分页查询所有实训的连接
   * @param pageInfoQ  分页信息
   * @constructor
   */
  public GetAllTrain(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train + '/?offset=' + pageInfoQ.offset + '&page=' + pageInfoQ.page;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all train failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        let trainQList: TrainQ[] = [];
        let orgId: number[] = [];
        for (const columnRef of response.data) {
          const trainQ: TrainQ = columnRef as TrainQ;
          orgId.push(trainQ.organization_id);
          trainQList.push(trainQ);
        }
        let url = API.org + '/name?org_id=' + orgId[0] ;
        for ( let i = 1; i < orgId.length; i++){
          url = url + ',' + orgId[i];
        }
        this.get(url).subscribe({
          next: res => {
            if (response.status !== 0) {
              this.logger.log(`Get org info by group failed with status code ${res.status}: ${res.msg}.`);
              observer.error(res);
            }else{
              let i = 0 ;
              for (const org of res.data) {
                trainQList[i].org_name = org;
                i++;
              }
              response.data = trainQList;
              observer.next(response);
              observer.complete();
            }
          },
          error: error => {
            this.logger.log(`Get org info by group failed with network error: `, error);
            observer.error(error);
          }
        });
      },
      error: error => {
        this.logger.log(`Get all train failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /***
   * 删除实训的连接
   * @param trainId  删除实训的ID
   * @constructor
   */
  public DeleteTrain(trainId: number[]): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const errorList: number[] = [];
    let length = trainId.length;
    for (const storageElement of trainId) {
      const url = API.train + '/' + storageElement;
      this.delete(url).subscribe({
        next: response => {
          if (response.status !== 0) {
            this.logger.log(`Delete train failed with status code ${response.status}: ${response.msg}.`);
            errorList.push(storageElement);
          }
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '实训';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        },
        error: error => {
          this.logger.log(`Delete train failed with network error: `, error);
          errorList.push(storageElement);
          length--;
          if (length <= 0) {
            if (errorList.length > 0) {
              let errorMessage = '实训';
              for (const columnRef of errorList) {
                errorMessage = errorMessage + columnRef + '、';
              }
              errorMessage = errorMessage + '删除失败';
              observer.error(errorMessage);
            } else {
              console.log(errorList.length);
              observer.next();
              setTimeout(() => {
                observer.complete();
              }, 1000);
            }
          }
        }
      });
    }
    return result;
  }


  /***
   * 获取对应实训的信息
   * @param trainId 对应实训的信息
   * @constructor
   */
  public GetTrain(trainId: string): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train + '/' + trainId;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get train failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get train failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetProject(projectId: string): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train_project + '/' + projectId + '/basic-info';
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get project failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
        }else{
          observer.next(response);
          observer.complete();
        }
      },
      error: error => {
        this.logger.log(`Get project failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }


  /***
   * 修改实训信息的连接
   * @param trainQ 对应实训的信息
   * @constructor
   */
  public UpdateTrain(trainQ: TrainQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);

    return result;
  }

  /***
   * 创建实训的连接
   * @param trainQ  对应实训的信息
   * @constructor
   */
  public CreateTrain(trainQ: CreateTrainQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.post(API.train, trainQ).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Create train failed with status code ${response.status}: ${response.msg}.`);
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
    });
    return result;
  }

  /***
   * 分页查询所有组织的连接
   * @param pageInfoQ  分页请求
   * @constructor
   */
  public GetAllOrg(pageInfoQ: PageInfoQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.org + '?page=' + pageInfoQ.page + '&offset=' + pageInfoQ.offset;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all org info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all org info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetAllProject(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.project + '/search/name?page=' + pageInfoQ.page + '&offset=' + pageInfoQ.offset + '&key_word=';
    console.log(url)
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all project failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all  project failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /**
   * 分页查询所有用户的连接
   * @param pageInfoQ  分页请求
   * @constructor
   */
  public GetAllUser(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.user + '/?offset=' + pageInfoQ.offset + '&page=' + pageInfoQ.page;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all user failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all user failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public ChangePassWordByForce(newPassword: ChangPwdByForce): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.put(API.change_password_force, newPassword).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Change passWord by force failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Change passWord by force failed with network error: `, error);
        observer.error(error);
      }
    })
    return result;
  }


  public GetTeamMember(teamId: number): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.team + '/' + teamId + '/member';
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get team member failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get team member failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetTeamInfo(teamId: number): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.team + '/' + teamId;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get team info failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get team info failed with network error: `, error);
        observer.error(error);
      }
    })
    return result;
  }

  public GetTeamList(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.search_team + '/name?key_word=&page=' + pageInfoQ.page + '&offset=' + pageInfoQ.offset ;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all team failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        const getTeamQList: GetTeamQ[] = [];
        const teamId: number[] = [];
        for (const observerElement of response.data) {
          const getTeamQ: GetTeamQ = observerElement as GetTeamQ;
          getTeamQList.push(getTeamQ);
          teamId.push(getTeamQ.id);
        }
        let teamBox: boolean[] = [];
        for (let i = 0 ; i < teamId.length; i++){
          teamBox.push(false);
          this.GetTeamMember(teamId[i]).subscribe({
            next: value => {
              for (const item of value.data) {
                const userInfo: UserInfo = item as UserInfo;
                getTeamQList[i].member = [];
                getTeamQList[i].member.push({
                  avatar: userInfo.avatar,
                  email: userInfo.email,
                  gender: userInfo.gender,
                  name: userInfo.name,
                  phone_number: userInfo.phone_number,
                  role_name: userInfo.role_name,
                  user_id: userInfo.user_id,
                  username: userInfo.username,
                });
                teamBox[i] = true;
              }
              let ifFinsih = true;
              for (const observerElement of teamBox) {
                if (!observerElement) ifFinsih = false;
              }
              if(ifFinsih){
                console.log(teamBox);
                response.data = getTeamQList;
                observer.next(response);
                observer.complete();
              }
            },
            error: err => {
              teamBox[i] = true;
              let ifFinsih = true;
              for (const observerElement of teamBox) {
                if (!observerElement) ifFinsih = false;
              }
              if(ifFinsih) {
                console.log(teamBox);
                response.data = getTeamQList;
                observer.next(response);
                observer.complete();
              }
            }
          });
        }
      },
      error: error => {
        this.logger.log(`Get all team failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;

  }

  public GetReceiverNotice(id: number): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.notice + '/receiver/' + id + '?offset=100&page=1';
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get notice failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get notice failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }


  public GetAllTeam(pageInfoQ: PageInfoQ): Observable<Resp> {
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.search_team + '/name?key_word=&page=' + pageInfoQ.page + '&offset=' + pageInfoQ.offset ;
    this.get(url).subscribe({
      next: response => {
        if (response.status !== 0) {
          this.logger.log(`Get all team failed with status code ${response.status}: ${response.msg}.`);
          observer.error(response);
          return result;
        }
        observer.next(response);
        observer.complete();
      },
      error: error => {
        this.logger.log(`Get all team failed with network error: `, error);
        observer.error(error);
      }
    })
    return result;

  }

  public GetTeam(pageInfoQ: PageInfoQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train + '?offset=' + pageInfoQ.offset + '&page=' + pageInfoQ.page ;
    this.get(url).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Get team info failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else {
          observer.next(resp);
          observer.complete();
        }
        },
      error: error => {
        this.logger.log(`Get team info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetTeamByProject( id: string ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.team + '/train/' + id + '?page=1&offset=100';
    this.get(url).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Get team info failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else {
          observer.next(resp);
          observer.complete();
        }
      },
      error: error => {
        this.logger.log(`Get team info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  public GetTeamByTrain( id: string ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.team + '/train/' + id + '?page=1&offset=100';
    this.get(url).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Get team info failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else {
          observer.next(resp);
          observer.complete();
        }
      },
      error: error => {
        this.logger.log(`Get team info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }


  public CreatProject(projectQ: ProjectQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const project = {
      project_name: projectQ.name,
      project_level: projectQ.level,
      project_content: projectQ.content
    };
    const projectList: any[] = [project];
    this.post(API.train_project, projectList).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Create project failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else{
          observer.next(resp);
          setTimeout(() => {
            observer.complete();
          }, 2000);
        }
      },
      error: error => {
        this.logger.log(`Create project failed with network error: `, error);
        observer.error(error);
      }
    })
    return result;
  }

  public UploadProjectInfo(id: number, projectQ: ProjectQ): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    const url = API.train_project + '/' + id + '/basic-info';
    this.put(url, projectQ).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Upload project info failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else{
          observer.next(resp);
          setTimeout(() => {
            observer.complete();
          }, 1000);
        }
      },
      error: error => {
        this.logger.log(`Upload project info failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }

  /**
   * 批量导入用户的连接
   * @param regQ 导入信息
   * @constructor
   */
  public PostEnterpriseAdminReg(regQ: PostRegisterQ[]): Observable<Resp>{
    let observer: Subscriber<Resp>;
    const result = new Observable<Resp>(o => observer = o);
    this.post(API.enterprise_admin, regQ).subscribe({
      next: resp => {
        if (resp.status !== 0) {
          this.logger.log(`Post enterprise-admin reg failed with status code ${resp.status}: ${resp.msg}.`);
          observer.error(resp);
        }else{
          observer.next(resp);
          setTimeout(() => {
            observer.complete();
          }, 1000);
        }
        },
      error: error => {
        this.logger.log(`Post enterprise-admin reg failed with network error: `, error);
        observer.error(error);
      }
    });
    return result;
  }
}
