import { Component, OnInit, HostListener  } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';
import { SipjsService } from '../app/services/sipjs.service';
import { Howl } from 'howler';
import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'DHcomm';
  glob: Globals;
  varToken: any;
  userInfo: any;
  varContacts = [];
  varContact = [];
  varContactsIn = [];
  varContactIn = [];
  rstUserInfo: any = {};
  varUserContacts = {};

  constructor(
    public breakpointObserver: BreakpointObserver,
    private authUser: AuthService,
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
    this.glob.userIn = this.authUser.isAuthenticated();
    this.rstUserInfo = JSON.parse(window.localStorage.getItem('userInfo'));

    if (this.glob.userIn) {

      this.getContacts();

    }

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

  ngOnInit(): void {

    this.glob.userIn = this.authUser.isAuthenticated();
    this.glob.onCall = false;
    this.glob.showDialpad = false;
    this.glob.showUsercontacts = false;
    this.glob.showOutgoingcall = false;
    this.glob.showOncall = false;
    this.glob.showIncomingcall = false;
    this.glob.globVideoChat = false;
    this.glob.globHoldCall = false;
    this.glob.globMuteCall = false;
    this.glob.showDialpadOnCall = false;
    this.glob.globXSmallDevices = false;
    this.glob.globSmallDevices = false;
    this.glob.globMediumDevices = false;
    this.glob.globLargeDevices = false;
    this.glob.globXLargeDevices = false;
    this.glob.globDtmfTrim = '';

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        // handle XSmall breakpoint
        console.log('++++++++++  XSMALL ++++++++++');
        this.glob.globXSmallDevices = true;
        this.glob.globSmallDevices = false;
        this.glob.globMediumDevices = false;
        this.glob.globLargeDevices = false;
        this.glob.globXLargeDevices = false;
        
      }
      if (result.breakpoints[Breakpoints.Small]) {
        // handle Small breakpoint
        console.log('++++++++++  SMALL ++++++++++');
        this.glob.globSmallDevices = true;
        this.glob.globXSmallDevices = false;
        this.glob.globMediumDevices = false;
        this.glob.globLargeDevices = false;
        this.glob.globXLargeDevices = false;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        // handle Medium breakpoint
        console.log('++++++++++  MEDIUM ++++++++++');
        this.glob.globMediumDevices = true;
        this.glob.globXSmallDevices = false;
        this.glob.globSmallDevices = false;
        this.glob.globLargeDevices = false;
        this.glob.globXLargeDevices = false;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        // handle Large breakpoint
        console.log('++++++++++  LARGE ++++++++++');
        this.glob.globLargeDevices = true;
        this.glob.globXSmallDevices = false;
        this.glob.globSmallDevices = false;
        this.glob.globMediumDevices = false;
        this.glob.globXLargeDevices = false;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        // handle XLarge breakpoint
        console.log('++++++++++  XLARGE ++++++++++');
        this.glob.globXLargeDevices = true;
        this.glob.globXSmallDevices = false;
        this.glob.globSmallDevices = false;
        this.glob.globMediumDevices = false;
        this.glob.globLargeDevices = false;
      }
    });

    

    console.log(this.glob.userIn);

    if (this.glob.userIn) {

      this.glob.globUser = JSON.parse(window.localStorage.getItem('userInfo'));
      this.userInfo = this.glob.globUser;
      console.log(this.glob.globUser);

      const userExtension = this.userInfo.extension.extension;
      const password = this.userInfo.extension.password;
      const userFullname = this.userInfo.contact_name_given + ' ' + this.userInfo.contact_name_family;
      const domain = this.userInfo.extension.dial_domain;
      const wssServer = this.userInfo.extension.dial_domain;

      const param = {ext: userExtension,
                      pwd: password,
                      fn: userFullname,
                      dom: domain,
                      wss: wssServer};

      this.sipJs.connect(param);

    }

    // const varNumb = '1002';
    // this.glob.incomingNumber = varNumb;
    // this.glob.onCallInfo = [] as any;
    // let info = [];
    // info = this.sipJs.filterContact(varNumb);

    // if (info) {
    //   console.log(info);
    //   this.glob.onCallInfo.push(info);
    // } else {
    //   this.glob.onCallInfo.push({contact_name_full: 'Unknow', contact_name_given: 'Un', contact_name_family: 'Know'});
    // }

  }

  



  filterContact(phoNumb: string) {

    this.varContacts = this.glob.globContacts;
    let varCont: any;

    if (phoNumb.length === 4) {
      this.varContacts.forEach((contact) => {
        if (contact.extension === phoNumb) {
          varCont = contact;
          return true;
        }
      });
    } else {
      this.varContacts.forEach((entry) => {
        entry.phones.forEach((numb) => {
          if (numb.phone_number === phoNumb) {
            varCont = entry;
            return true;
          }
        });
      });
    }
    return varCont;
  }

}
