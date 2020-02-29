import { Component, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.component.html',
  styleUrls: ['./incoming-call.component.css']
})
export class IncomingCallComponent implements OnInit {

  glob: Globals;



  constructor(
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
   }

  ngOnInit() {
  }

  answerCall() {
    this.glob.incomingcallSound.stop();
    this.sipJs.answerCall();
    this.glob.showIncomingcall = false;
    this.glob.showOutgoingcall = false;
    this.glob.showOncall = true;
  }

  hangupCall() {
    this.glob.incomingcallSound.stop();
    this.sipJs.hangupCall();
    this.glob.showIncomingcall = false;
    this.glob.globVideoChat = false;
  }

  rejectCall() {
    this.glob.incomingcallSound.stop();
    this.glob.showIncomingcall = false;
    this.glob.globVideoChat = false;
    this.sipJs.handleRejectIncoming();
  }

}
