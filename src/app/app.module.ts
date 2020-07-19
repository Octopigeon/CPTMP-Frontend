import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ErrorHandler, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {windowProvider, WINDOW} from "./services/window";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatSnackBar} from "@angular/material/snack-bar";
import {GoogleMapsModule} from '@angular/google-maps';

import {CustomIconRegistry, SVG_ICONS} from "./shared/custom-icon-registry";
import {SearchBoxComponent} from './components/search-box/search-box.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {SidebarModePipe} from './pipes/sidebar-mode.pipe';
import {NavMenuComponent} from './components/nav-menu/nav-menu.component';
import {NavItemComponent} from './components/nav-item/nav-item.component';
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {FooterComponent} from './components/footer/footer.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RegisterComponent} from './components/register/register.component';
import {MatStepperModule} from "@angular/material/stepper";
import {NotFoundComponent} from './components/not-found/not-found.component';
import {PersonalDataComponent} from './contents/personal-data/personal-data.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatTreeModule} from "@angular/material/tree";
import {MatGridListModule} from "@angular/material/grid-list";
import {Overlay} from "@angular/cdk/overlay";
import {MatRadioModule} from "@angular/material/radio";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ChangeAvatarComponent} from './popups/change-avatar/change-avatar.component';
import {MatDialogModule} from "@angular/material/dialog";
import {SchoolAdminComponent} from './contents/school-admin/school-admin.component';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SchoolEditComponent} from './popups/school-edit/school-edit.component';
import {AccountAdminComponent} from './contents/account-admin/account-admin.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatPaginatorModule} from "@angular/material/paginator";
import {AccountEditComponent} from './popups/account-edit/account-edit.component';
import {MatSelectModule} from "@angular/material/select";
import {AccountBulkAddComponent} from './popups/account-bulk-add/account-bulk-add.component';
import {SingleInputComponent} from './popups/single-input/single-input.component';
import {TrainAdminComponent} from './contents/train-admin/train-admin.component';
import {SingleTextareaComponent} from './popups/single-textarea/single-textarea.component';
import {TrainDetailComponent} from './contents/train-detail/train-detail.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FileSizePipe} from './pipes/file-size.pipe';
import {SelectFileComponent} from './popups/select-file/select-file.component';
import {ProjectAdminComponent} from './contents/project-admin/project-admin.component';
import {ProjectDetailComponent} from './contents/project-detail/project-detail.component';
import {ProjectListComponent} from './contents/project-list/project-list.component';
import {MatCardModule} from "@angular/material/card";
import {TeamAdminComponent} from './contents/team-admin/team-admin.component';
import {MatChipsModule} from "@angular/material/chips";
import {TeamDetailComponent} from './contents/team-detail/team-detail.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {TeamListComponent} from './contents/team-list/team-list.component';
import {InviteComponent} from './components/invite/invite.component';
import {LocationPickerComponent} from './components/location-picker/location-picker.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { JoinRequestComponent } from './components/join-request/join-request.component';


// These are the hardcoded inline svg sources to be used by the `<mat-icon>` component.
// tslint:disable: max-line-length
export const svgIconProviders = [
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'close',
      svgSource:
        '<svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />' +
        '<path d="M0 0h24v24H0z" fill="none" />' +
        '</svg>',
    },
    multi: true,
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'insert_comment',
      svgSource:
        '<svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />' +
        '<path d="M0 0h24v24H0z" fill="none" />' +
        '</svg>',
    },
    multi: true,
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'keyboard_arrow_right',
      svgSource:
        '<svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />' +
        '</svg>',
    },
    multi: true,
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'menu',
      svgSource:
        '<svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />' +
        '</svg>',
    },
    multi: true,
  },

  // Namespace: logos
  {
    provide: SVG_ICONS,
    useValue: {
      namespace: 'logos',
      name: 'github',
      svgSource:
        '<svg focusable="false" viewBox="0 0 51.8 50.4" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M25.9,0.2C11.8,0.2,0.3,11.7,0.3,25.8c0,11.3,7.3,20.9,17.5,24.3c1.3,0.2,1.7-0.6,1.7-1.2c0-0.6,0-2.6,0-4.8' +
        'c-7.1,1.5-8.6-3-8.6-3c-1.2-3-2.8-3.7-2.8-3.7c-2.3-1.6,0.2-1.6,0.2-1.6c2.6,0.2,3.9,2.6,3.9,2.6c2.3,3.9,6,2.8,7.5,2.1' +
        'c0.2-1.7,0.9-2.8,1.6-3.4c-5.7-0.6-11.7-2.8-11.7-12.7c0-2.8,1-5.1,2.6-6.9c-0.3-0.7-1.1-3.3,0.3-6.8c0,0,2.1-0.7,7,2.6' +
        'c2-0.6,4.2-0.9,6.4-0.9c2.2,0,4.4,0.3,6.4,0.9c4.9-3.3,7-2.6,7-2.6c1.4,3.5,0.5,6.1,0.3,6.8c1.6,1.8,2.6,4.1,2.6,6.9' +
        'c0,9.8-6,12-11.7,12.6c0.9,0.8,1.7,2.4,1.7,4.7c0,3.4,0,6.2,0,7c0,0.7,0.5,1.5,1.8,1.2c10.2-3.4,17.5-13,17.5-24.3' +
        'C51.5,11.7,40.1,0.2,25.9,0.2z" />' +
        '</svg>',
    },
    multi: true,
  },
];

// tslint:enable: max-line-length

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    SidebarModePipe,
    NavMenuComponent,
    NavItemComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    PersonalDataComponent,
    RegisterComponent,
    ChangeAvatarComponent,
    SchoolAdminComponent,
    SchoolEditComponent,
    AccountAdminComponent,
    AccountEditComponent,
    AccountBulkAddComponent,
    SingleInputComponent,
    TrainAdminComponent,
    SingleTextareaComponent,
    TrainDetailComponent,
    FileSizePipe,
    SelectFileComponent,
    ProjectAdminComponent,
    ProjectDetailComponent,
    ProjectListComponent,
    TeamAdminComponent,
    TeamDetailComponent,
    TeamListComponent,
    InviteComponent,
    LocationPickerComponent,
    JoinRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatExpansionModule,
    MatListModule,
    MatTreeModule,
    MatGridListModule,
    ImageCropperModule,
    MatRadioModule,
    MatTooltipModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    ClipboardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    GoogleMapsModule,
    MatSliderModule,
    MatSlideToggleModule,
  ],
  providers: [
    ErrorHandler,
    svgIconProviders,
    MatSnackBar,
    Overlay,
    {provide: MatIconRegistry, useClass: CustomIconRegistry},
    {provide: WINDOW, useFactory: windowProvider},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
