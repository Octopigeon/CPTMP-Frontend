import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {environment} from "../environments/environment";
import {PersonalDataComponent} from "./contents/personal-data/personal-data.component";
import {LoginComponent} from "./components/login/login.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {RegisterComponent} from "./components/register/register.component";
import {SchoolAdminComponent} from "./contents/school-admin/school-admin.component";
import {AccountAdminComponent} from "./contents/account-admin/account-admin.component";

import {TrainAdminComponent} from "./contents/train-admin/train-admin.component";
import {TrainDetailComponent} from "./contents/train-detail/train-detail.component";
import {ProjectAdminComponent} from "./contents/project-admin/project-admin.component";
import {ProjectDetailComponent} from "./contents/project-detail/project-detail.component";
import {ProjectListComponent} from "./contents/project-list/project-list.component";
import {TeamAdminComponent} from "./contents/team-admin/team-admin.component";
import {TeamDetailComponent} from "./contents/team-detail/team-detail.component";
import {TeamListComponent} from "./contents/team-list/team-list.component";
import {InviteComponent} from "./components/invite/invite.component";
import {JoinRequestComponent} from "./components/join-request/join-request.component";
import {MessageComponent} from "./contents/message/message.component";
import {StatGraphComponent} from './contents/stat-graph/stat-graph.component';
import {AbilityGraphComponent} from './contents/ability-graph/ability-graph.component';
import {ChatComponent} from './components/chat/chat.component';
import {CameraSignComponent} from './popups/camera-sign/camera-sign.component';
import {EmptyComponent} from './components/empty/empty.component';
import {LocationSignComponent} from './popups/location-sign/location-sign.component';


const routes: Routes = [
  { path: 'plat/user/me', component: PersonalDataComponent },
  { path: 'plat/test', component: EmptyComponent },
  //{ path: 'plat/test', component: TrainAdminComponent, data: {type: 'enterprise'}  },
  // { path: 'activate/:token'},
  { path: 'info/invite', component: InviteComponent },   //  转到邀请加入团队界面
  { path: 'info/join', component: JoinRequestComponent },  //  转到加入团队界面
  { path: 'register', component: RegisterComponent },   // 转到注册界面
  { path: 'plat/project/detail', component: ProjectDetailComponent },   // 转到项目详细信息界面
  { path: 'plat/train/detail/:id', component: TrainDetailComponent},   // 转到实训详细信息界面
  { path: 'plat/account', component: AccountAdminComponent, data: {type: 'enterprise'} },   // 转到用户管理界面
  { path: 'plat/project', component: ProjectAdminComponent},   // 转到项目管理界面
  { path: 'plat/projectList', component: ProjectListComponent},  // 转到项目列表界面
  { path: 'plat/org', component: SchoolAdminComponent},  // 转到组织管理界面
  { path: 'plat/team', component: TeamAdminComponent},  //  转到团队管理界面
  { path: 'plat/teamList', component: TeamListComponent},  // 转到团队列表界面
  { path: 'plat/team/detail', component: TeamDetailComponent},  // 转到团队详细信息界面
  { path: 'plat/train', component: TrainAdminComponent},  // 转到实训管理界面
  { path: 'plat/user/message', component: MessageComponent }, // 转到用户消息页面
  { path: 'plat/stat/:id', component: StatGraphComponent }, // 转到统计图表页面
  { path: 'plat/user/ability/:id', component: AbilityGraphComponent }, // 转到能力图表页面
  { path: '', component: LoginComponent, pathMatch: 'full' },  // 转到登陆界面
  { path: '**', component: NotFoundComponent }  // 转到404界面
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { enableTracing: !environment.production }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
