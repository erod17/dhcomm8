import { Component, OnInit } from '@angular/core';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-caller-buttons',
  templateUrl: './caller-buttons.component.html',
  styleUrls: ['./caller-buttons.component.css']
})
export class CallerButtonsComponent implements OnInit {

  glob: Globals;

  constructor(
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
   }

  ngOnInit() {
  }



  hangupCall() {
    if (this.glob.showOutgoingcall === true) {
      this.glob.showOutgoingcall = false;
    }
    this.glob.showOncall = false;
    this.glob.globVideoChat = false;
    this.glob.showDialpad = false;
    this.sipJs.hangupCall();
  }

  switchDialpad() {
    // this.glob.outgoingNumber = this.glob.outgoingNumber;
    // console.log(this.glob.outgoingNumber);

    this.glob.showDialpadOnCall = !this.glob.showDialpadOnCall;
  }

  setVideoChat() {

    const opt: string = (this.glob.globVideoChat) ? 'audio' : 'video';

    this.hangupCall();
    if (this.sipJs.handleOutgoingCall(this.glob.outgoingNumber, opt)) {
      this.glob.showDialpad = false;
      console.log(this.glob.onCallInfo);
      this.glob.showOutgoingcall = true;
      // this.glob.outgoingSound.play();
    } else {
      alert('Impossible');
    }

  }

  setHold() {
    this.sipJs.setHoldOnCall();
  }

  setMute() {
    // this.sipJs.setMuteOnCall();
  }



}
