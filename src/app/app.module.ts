import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';

import { Globals } from './globals';
// import { SipjsService } from './services/sipjs.service';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { from } from 'rxjs';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AccountActivateComponent } from './account-activate/account-activate.component';
import { AuthComponent } from './auth/auth.component';
import { MainNavComponent, BottomSheetListCallcenterComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DialpadComponent } from './dialpad/dialpad.component';
import { VideoCallComponent } from './video-call/video-call.component';
import { UserContactsComponent } from './user-contacts/user-contacts.component';
import { OutgoingCallComponent } from './outgoing-call/outgoing-call.component';
import { OnCallComponent } from './on-call/on-call.component';
import { IncomingCallComponent } from './incoming-call/incoming-call.component';
import { CallerButtonsComponent } from './caller-buttons/caller-buttons.component';
import { TransferCallComponent } from './transfer-call/transfer-call.component';
import { DtmfComponent } from './dtmf/dtmf.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrgStructureComponent } from './org-structure/org-structure.component';
import { CallCenterComponent } from './call-center/call-center.component';
import { CallCenterListComponent } from './call-center-list/call-center-list.component';


export function tokenGetter() {
  return window.localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    DashboardComponent,
    PageNotFoundComponent,
    ResetPasswordComponent,
    SignUpComponent,
    AccountActivateComponent,
    MainNavComponent, BottomSheetListCallcenterComponent,
    DialpadComponent,
    VideoCallComponent,
    UserContactsComponent,
    OutgoingCallComponent,
    OnCallComponent,
    IncomingCallComponent,
    CallerButtonsComponent,
    TransferCallComponent,
    DtmfComponent,
    UserProfileComponent,
    OrgStructureComponent,
    CallCenterComponent,
    CallCenterListComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbAlertModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['example.com'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
    }),
    FlexLayoutModule,
    LayoutModule,
    AngularMaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [BottomSheetListCallcenterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbAlertModule, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
