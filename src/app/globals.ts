import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable()
export class Globals {

  // apiURL = 'https://api.dhcomm.net';
  apiURL = 'http://localhost:8000';

  globUser = [];
  globContacts = [];
  pathImgProfile: any;
  userIn: any;
  outgoingNumber: string;
  incomingNumber: string;
  onCallInfo = [];
  outgoingSound = new Howl({src: ['https://dhcomm.net/sounds/RingBack.mp3'], loop: true, html5 : true});
  incomingcallSound = new Howl({src: ['https://dhcomm.net/sounds/warble4-trill.wav'], loop: true, html5 : true});
  showOutgoingcall: boolean;
  onCall: boolean;
  showOncall: boolean;
  showIncomingcall: boolean;
  showDialpad: boolean;
  showUsercontacts: boolean;
  showDialpadOnCall: boolean;
  globVideoChat: boolean;
  globMuteCall: boolean;
  globVideoStatus = 'Start Videochat';
  globHoldCall: boolean;
  globCallHoldStatus = 'Call on Hold';
  globDtmfTrim: string;

  globXSmallDevices: boolean;
  globSmallDevices: boolean;
  globMediumDevices: boolean;
  globLargeDevices: boolean;
  globXLargeDevices: boolean;

}
