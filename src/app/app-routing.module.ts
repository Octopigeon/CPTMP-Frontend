import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {environment} from "../environments/environment";
import {PersonalDataComponent} from "./contents/personal-data/personal-data.component";
import {LoginComponent} from "./components/login/login.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {RegisterComponent} from "./components/register/register.component";
import {SchoolAdminComponent} from "./contents/school-admin/school-admin.component";
import {AccountAdminComponent} from "./contents/account-admin/account-admin.component";
<<<<<<< HEAD
=======
import {TrainAdminComponent} from "./contents/train-admin/train-admin.component";
import {TrainDetailComponent} from "./contents/train-detail/train-detail.component";
import {ProjectAdminComponent} from "./contents/project-admin/project-admin.component";
import {ProjectDetailComponent} from "./contents/project-detail/project-detail.component";
import {ProjectListComponent} from "./contents/project-list/project-list.component";
import {TeamAdminComponent} from "./contents/team-admin/team-admin.component";
>>>>>>> 30f657f9a720f0cdbbca82446e0a4bcde895a9d1


const routes: Routes = [
  { path: 'plat/user/me', component: PersonalDataComponent },
<<<<<<< HEAD
  // { path: 'plat/test', component: SchoolAdminComponent },
  { path: 'plat/test', component: AccountAdminComponent, data: {type: 'enterprise'}  },
=======
  { path: 'plat/test', component: TeamAdminComponent },
  // { path: 'plat/test', component: AccountAdminComponent, data: {type: 'enterprise'}  },
>>>>>>> 30f657f9a720f0cdbbca82446e0a4bcde895a9d1
  // { path: 'activate/:token'},
  { path: 'register', component: RegisterComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { enableTracing: !environment.production }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
