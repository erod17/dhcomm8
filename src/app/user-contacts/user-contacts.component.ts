import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-user-contacts',
  templateUrl: './user-contacts.component.html',
  styleUrls: ['./user-contacts.component.css']
})
export class UserContactsComponent implements OnInit {

  glob: Globals;
  varContacts = [];
  varContact = [];
  
  constructor(
    private sipJs: SipjsService,
    private authUser: AuthService,
    glob: Globals
  ) {
    this.glob = glob;
   }

  ngOnInit() {
  }

  makeCall(phoNumb: any, opt: string) {


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

  transferCall(phoNumb: any, optAfterT: any) {

    this.sipJs.transferCall(phoNumb, optAfterT);

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

}
