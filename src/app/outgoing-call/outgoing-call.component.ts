import { Component, OnInit } from '@angular/core';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';


@Component({
  selector: 'app-outgoing-call',
  templateUrl: './outgoing-call.component.html',
  styleUrls: ['./outgoing-call.component.css']
})
export class OutgoingCallComponent implements OnInit {

  glob: Globals;

  constructor(
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
   }

  ngOnInit() {
    this.glob.onCallInfo = [];
  }

  hangupCall() {
    if (this.glob.showOutgoingcall === true) {
      this.glob.showOutgoingcall = false;
    }
    this.glob.outgoingSound.stop();
    this.glob.showOncall = false;
    this.glob.globVideoChat = false;
    this.glob.showDialpad = false;
    this.glob.globVideoChat = false;
    this.sipJs.hangupCall();
  }

  

}
