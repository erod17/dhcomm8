import { CommonModule } from '@angular/common';
import { Input, Component, OnInit, ChangeDetectorRef, AfterContentChecked  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SipjsService } from '../services/sipjs.service';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Globals } from '../globals';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterContentChecked {

    userToken = {};
    userInfo = {};

    glob: Globals;
    varToken: any;
    varUserContacts = {};
    invalidLogin = false;
    loginForm: FormGroup;
  
    matcher = new MyErrorStateMatcher();
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authUser: AuthService,
      private sipJs: SipjsService,
      private changeDetector: ChangeDetectorRef,
      glob: Globals
  ) {
    this.glob = glob;
  }

    staticAlertClosed = true;

    ngOnInit(): void {

      setTimeout(() => this.staticAlertClosed = true, 1000);

      this.sipJs.disconnect();

      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('userContacts');
      window.localStorage.removeItem('verto_session_uuid');
      window.localStorage.removeItem('res_any');


      this.glob.globUser = [];
      this.glob.globContacts = [];
      this.glob.onCallInfo = [];
      this.glob.userIn = false;
      this.glob.onCall = false;
      this.glob.showOncall = false;
      this.glob.showDialpad = false;
      this.glob.showUsercontacts = false;
      this.glob.globVideoChat = false;
      this.glob.showOutgoingcall = false;
      this.glob.showIncomingcall = false;
      this.glob.showDialpadOnCall = false;
      this.glob.globMuteCall = false;
      this.glob.globHoldCall = false;
      this.glob.outgoingNumber = '';
      this.glob.incomingNumber = '';
      this.glob.globDtmfTrim = '';
      this.glob.globVideoStatus = 'Start Videochat';
      this.glob.globCallHoldStatus = 'Call on Hold';

      this.loginForm = this.formBuilder.group({
        username: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required]
      });

    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }


    onSubmit() {
      if (this.loginForm.invalid) {
        return;
      }
      const loginPayload = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      };

      this.authUser.userLogin(loginPayload).subscribe((data) => {
        if (data) {
          this.userToken = data;
          this.userToken = Array.of(this.userToken);
          window.localStorage.setItem('token', this.userToken[0].data.original.access_token);

          this.authUser.updateUserStatus(this.userToken[0].data.original.access_token)
            .subscribe((data9: any) => {
              if (data9) {
                console.log(data9);
              } else {
                console.log('************************************************************************');
              }
            });

          console.log(this.userToken[0].data.original.access_token);

          this.authUser.getUserInfo(this.userToken[0].data.original.access_token)
            .subscribe((data: any) => {
                this.userInfo = data;
                this.userInfo = Array.of(this.userInfo);
                window.localStorage.setItem('userInfo', JSON.stringify(this.userInfo[0].data));
                this.glob.globUser = JSON.parse(window.localStorage.getItem('userInfo'));
                this.glob.userIn = true;
                console.log(this.glob.globUser);

                const userExtension = this.userInfo[0].data.extension.extension;
                const password = this.userInfo[0].data.extension.password;
                const userFullname = this.userInfo[0].data.contact_name_given + ' ' + this.userInfo[0].data.contact_name_family;
                const domain = this.userInfo[0].data.extension.dial_domain;
                const wssServer = this.userInfo[0].data.extension.dial_domain;

                const param = {ext: userExtension,
                               pwd: password,
                               fn: userFullname,
                               dom: domain,
                               wss: wssServer};

                this.sipJs.connect(param);

                if (window.localStorage.getItem('userInfo')) {
                  this.router.navigate(['dashboard']);
                }
          });
          this.getContacts();
        }
      }, err => {

        if (err.status === 401) {
          console.log(err.status);
          this.staticAlertClosed = false;
        }
      });
    }

    getContacts() {

      this.varToken = window.localStorage.getItem('token');
      this.authUser.getUserContacts(this.varToken)
        .subscribe((data: any) => {
          if (data.code === '200') {
            this.varUserContacts = data.data;
            this.varUserContacts = Array.of(this.varUserContacts);
            window.localStorage.setItem('userContacts', JSON.stringify(this.varUserContacts));
            this.glob.globContacts = JSON.parse(window.localStorage.getItem('userContacts'))[0];
            console.log(this.glob.globContacts);
          }
        }, err => {
  
          if (err.status === 401) {
            console.log('*************** E R R O R  **************');
            console.log(err.status);
          }
      });
  
    }
}
