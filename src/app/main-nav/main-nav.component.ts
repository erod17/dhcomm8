import { Component, OnInit, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, timer } from 'rxjs';
import { filter, takeWhile, map, shareReplay, timeout } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators, FormControlName } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { CallCenterService } from '../services/call-center.service';
import { Token } from '@angular/compiler';



@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})

export class MainNavComponent implements OnInit {

  showBkSpce = false;
  glob: Globals;
  panelOpenState = false;
  rstUserInfo: any = {};
  varUserContacts = {};
  varContacts = [];
  varContact = [];
  rstQueues = [];
  varToken: any;

  count: number;
  counter: Observable<number>;

  // varTimer = timer(3000, 1000);
  
  
  callerForm = new FormGroup({
    phoneNumber: new FormControl('')
  });


  constructor(
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder,
        private authUser: AuthService,
        private sipJs: SipjsService,
        private _bottomSheet: MatBottomSheet,
        private CCService: CallCenterService,
        glob: Globals) {
          this.glob = glob;
          this.varToken = window.localStorage.getItem('token');
        }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  ngOnInit() {
    
    this.glob.userIn = this.authUser.isAuthenticated();

    this.callerForm = this.formBuilder.group({
      phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(11)])]
    });


  }

  onTimeOut() {
    console.log('cada 10 segundos/... mensaje');
  }

  makeCall(opt: string) {
    if (this.callerForm.invalid) {
      return;
    }
    const phoNumb = this.callerForm.controls.phoneNumber.value;

    if (this.glob.onCall && !this.glob.globVideoChat) {
      this.hangupCall();
      if (this.sipJs.handleOutgoingCall(this.glob.outgoingNumber, opt)) {
        this.glob.showDialpad = false;
        this.glob.showOutgoingcall = true;
        // this.glob.outgoingSound.play();
      } else {
        alert('Impossible');
      }
      return true;
    } else if (this.glob.onCall && this.glob.globVideoChat) {
      this.hangupCall();
      if (opt === 'video') { opt = 'audio'; }
    }

    this.glob.outgoingNumber = phoNumb;
    this.glob.onCallInfo = [] as any;
    let info = [];
    info = this.sipJs.filterContact(phoNumb);

    if (info) {
      console.log(info);
      this.glob.onCallInfo.push(info);
    } else {
      this.glob.onCallInfo.push({contact_name_full: 'Unknow', contact_name_given: 'Un', contact_name_family: 'Know'});
    }


    if (this.sipJs.handleOutgoingCall(phoNumb, opt)) {
      this.glob.showDialpad = false;
      console.log(this.glob.onCallInfo);
      this.glob.showOutgoingcall = true;
      this.glob.outgoingSound.play();
    } else {
      alert('Impossible');
    }
  }


  hangupCall() {
    if (this.glob.showOutgoingcall === true) {
      this.glob.showOutgoingcall = false;
    }
    this.glob.outgoingSound.stop();
    this.glob.globVideoChat = false;
    this.sipJs.hangupCall();
  }

  setStatusColor(status: any) {
    if (status === 'Available') {
      return '#108C15';
    } else if (status === 'Away') {
      return '#EFB90F';
    } else if (status === 'Do not disturb') {
      return '#FA0325';
    } else if (status === 'Busy on call') {
      return '#3EBADC';
    } else {
      return '#C3C7C8';
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }

    if (this.callerForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
  }

  changeCallNumber() {
    this.glob.outgoingNumber = this.callerForm.controls.phoneNumber.value;
    if (this.callerForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
  }
  backSpacePhoneNumber() {

    this.callerForm.controls['phoneNumber'].setValue(this.callerForm.controls.phoneNumber.value.substr(0, this.callerForm.controls.phoneNumber.value.length - 1));
    // this.calling = this.calling.substr(0, this.calling.length - 1);
    this.glob.outgoingNumber = this.callerForm.controls.phoneNumber.value;
    if (this.callerForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }


  }

  switchDialpad() {
    this.glob.outgoingNumber = this.callerForm.controls.phoneNumber.value;
    console.log(this.glob.outgoingNumber);

    this.glob.showDialpad = !this.glob.showDialpad;
  }

  switchVideocall() {
    this.glob.globVideoChat = !this.glob.globVideoChat;
  }

  switchUsercontacts() {
    this.glob.showUsercontacts = !this.glob.showUsercontacts;

    // const varTimer = timer(3000, 1000);
    // const subscribe = varTimer.subscribe(val => console.log(val));
    // console.log(this.glob.showUsercontacts);
    // if (!this.glob.showUsercontacts) {
    //   // setTimeout(() => {
    //     subscribe.unsubscribe();
    //   // }, 1000);
    // }



    console.log(this.glob.showUsercontacts);

    this.counter = new Observable<number>(observer => {
      console.log('[takeWhile] Subscribed');

      let index = -1;
      const interval = setInterval(() => {
        index++;
        console.log(`[takeWhile] next: ${index}`);
        this.getContacts();
        observer.next(index);
      }, 2000);

      // teardown
      return () => {
        console.log('[takeWhile] Teardown');
        clearInterval(interval);
      };
    });


    this.counter
    .pipe(takeWhile(() => this.glob.showUsercontacts))
    .subscribe(
      (value) => this.count = value,
      (error) => console.error(error),
      () => console.log('[takeWhile] complete')
    );



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


  openBottomSheet(): void {

    // if (this.glob.userIn) {

      this.CCService.getQueues(this.varToken, null).subscribe((callback: any) => {
        if (callback) {
          this.rstQueues = callback.data;

          console.log(this.rstQueues);
          // traer datos de la tabla queues from fusionpbx

          this._bottomSheet.open(BottomSheetListCallcenterComponent, {
            data: this.rstQueues
          });

        }

      });
    // }

  }




}



@Component({
  selector: 'app-bottom-sheet-list-callcenter',
  templateUrl: 'list-callcenter.html'
})

export class BottomSheetListCallcenterComponent {

  dataSource =  this.data;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetListCallcenterComponent>
  ) {}


  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}




export interface GetQueues {
  callCenterUUID: string;
}
