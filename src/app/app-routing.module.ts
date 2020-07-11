import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {environment} from "../environments/environment";
import {PersonalDataComponent} from "./contents/personal-data/personal-data.component";
import {LoginComponent} from "./components/login/login.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";


const routes: Routes = [
  { path: 'plat/user/me', component: PersonalDataComponent },

  // { path: 'activate/:token'},
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
