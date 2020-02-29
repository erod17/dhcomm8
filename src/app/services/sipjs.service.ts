import { Injectable, Inject } from '@angular/core';
import audioPlayer from './sounds.service';
import { ToneService } from './tone.service';
import * as SIP from 'sip.js';
import { Globals } from '../globals';

function _window(idElement: any): any {
  // return the global native browser window object
  return window.document.getElementById(idElement);
}

@Injectable({
  providedIn: 'root'
})


export class SipjsService {

  private _ua: any;
  private _audioElement: HTMLAudioElement;
  public state = {
    init            : false,
    status          : 'disconnected',
    session         : null,
    ringing         : false,
    incomingSession : null,
    autoanswer      : false
  };

  glob: Globals;
  varContacts = [];
  varContact = [];
  varContactsIn = [];
  varContactIn = [];
  varLocalIsPlaying = false;
  varRemoteIsPlaying = false;

  mediaOptions = {
    sessionDescriptionHandlerOptions : {
      constraints: {
        audio: true,
        video: false
      }
    }
  };

  mediaOptionsVideoChat = {
    sessionDescriptionHandlerOptions : {
      constraints: {
        audio:  {
          optional: [
              {googEchoCancellation: true},
              {googAutoGainControl: true},
              {googNoiseSuppression: true},
              {googHighpassFilter: true},
              {googAudioMirroring: false},
              {googNoiseSuppression2: true},
              {googEchoCancellation2: true},
              {googAutoGainControl2: true},
              {googDucking: false}
          ]
        },
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 776, ideal: 720, max: 1080 }
         },
         frameRate: {
             ideal: 60,
             min: 10
         }
      },
      inviteWithoutSdp: true
    }
  };

  pc: any;
  senders: any;
  receivers: any;
  localStream: any;
  remoteStream: any;

  offeredAudio = false;
  offeredVideo = false;

  constructor(
    public toneService: ToneService,
    glob: Globals
  ) {
    audioPlayer.initialize();
    this.glob = glob;
  }

  
  connect(userData: any) {
    if (!userData) {
        return;
    }

    if (this._ua && (this.state.status === 'registered' || this.state.status === 'connected')) {
      this.disconnect();
    }

    console.log(userData);

    // Setup SIPJs
    try {
        const reguri = userData.ext + '@' + userData.dom;
        this._ua = new SIP.UA({
            uri: reguri,
            password: userData.pwd,
            displayName: userData.fn,
            transportOptions: {
              wsServers: ['wss://dhcomm.net:7443'],
              register: true,
              // traceSip: true,
              iceCheckingTimeout: 35000,
            }

        });

        // Add events to SIPJs
        this.addEvents(this._ua);

        // Start SIPJs
        this._ua.start();
        this.setState({init : true });

    } catch (error) {
        console.log('JsSIP config error', error);
        return;
    }
  }

  addEvents(sipUa: any) {
    sipUa.on('connecting', () =>
        this.setState({ status : 'connecting' }));

    sipUa.on('connected', () => {
        this.setState({ status: 'connected' });
        sipUa.register();
    });

    sipUa.on('disconnected', () =>
        this.setState({ status: 'disconnected' }));

    sipUa.on('registered', () => {
      console.log('+++++  user registered successfull  +++++');
      this.setState({ status: 'registered' });
    });

    sipUa.on('unregistered', () => {
        const connected = (sipUa.isRegistered()) ? 'connected' : 'disconnected';
        this.setState({ status:  connected});
    });

    sipUa.on('message', (data) => {
        console.log('[SMS] - New Message', data);
        // this.incomingSms.next(data);
    });

    sipUa.on('registrationFailed', (data: any) => {
        console.log('---------- Registration Failed! ----------');
        console.log(data.cause);
        this.setState({ status: data.cause });
    });

    // \\ incoming calls // \\
    sipUa.on('invite', (data: any) => {
        this.handleIncomingCall(data);
    });

  }

  handleIncomingCall(data: any) {
    console.log(':::::::::::::::::::: INCOMING CALL OPTIONS ::::::::::::::::::::');
    console.log(data);

    console.log(data.request.body);
    const session = data;
    const varNumb = session.remoteIdentity.uri.normal.user;

    const sdp = session.request.body;
  
    if ((/\r\nm=audio /).test(sdp)) {
      this.offeredAudio = true;
    }

    // if ((/\r\nm=video /).test(sdp)) {
    if ((/\r\na=rtpmap:102 /).test(sdp)) {
      // alert('video SI');
      this.offeredVideo = true;
    }

    if ((/\r\na=rtpmap:103 /).test(sdp)) {
      // alert('video NO');
      this.offeredVideo = false;
    }


    console.log(this.offeredAudio + ' <<< - >>> ' + this.offeredVideo);

    session.on('addStream', (stream) => {
      alert('addstream');
    });

    session.on('addTrack', (track) => {
      alert('addtrack');
    });

    session.on('trackAdded', () => {
      this.addStream(session);

      // // Gets remote tracks
      // console.log(pc.getRemoteStreams());
      // const remoteStream = new MediaStream();
      // console.log(pc.getReceivers());
      // console.log(remoteStream);
      // pc.getReceivers().forEach((receiver) => {
      //     remoteStream.addTrack(receiver.track);
      // });
      // console.log(remoteStream);

      // this.nativeWindow('remoteVideo').srcObject = remoteStream;
      // this.nativeWindow('remoteVideo').onloadedmetadata = (event) => {
      //   console.log(event);
      //   this.nativeWindow('remoteVideo').play();
      // };

    });

    session.on('failed', (err: any) => {
      this.clearSessions();
      this.removeSounds();
    });

    session.on('ended', () => {
      alert('ended');
      this.clearSessions();
      this.removeSounds();
    });

    session.on('bye', (request: any) => {

      this.terminatedCall();

    });

    session.on('accepted', (response, cause) => {
      this.setState({
          session         : data,
          incomingSession : null
      });
      this.acceptedCall();
    });

    // \\ refer // \\
    session.on('refer', () => {
      alert("refer");     // that's working
    });

    session.on('referRequested', (referServerContext) => {
      alert('referRequested');
    });

    // Avoid if busy or other incoming
    if (this.state.session || this.state.incomingSession) {
        session.terminate({
          status_code   : 486,
          reason_phrase : 'Busy Here'
        });
        return;
    } else {

        this.setState({ incomingSession: session });

        this.glob.incomingcallSound.play();

        this.glob.incomingNumber = varNumb;
        this.glob.onCallInfo = [] as any;
        let info = [];
        info = this.filterContact(varNumb);

        if (info) {
          console.log(info);
          this.glob.onCallInfo.push(info);
        } else {
          this.glob.onCallInfo.push({contact_name_full: 'Unknow', contact_name_given: 'Un', contact_name_family: 'Know'});
        }

        this.glob.showDialpad = false;
        this.glob.showIncomingcall = true;

        console.log(this.glob.onCallInfo);

    }

    if ( this.state.autoanswer === true ) {
      session.accept();
      this.setState({ autoanswer: false });
    }
}

  answerCall() {
    if (this.offeredVideo) {
      this.state.incomingSession.accept(this.mediaOptionsVideoChat);
    } else {
      this.state.incomingSession.accept(this.mediaOptions);
    }


  }

  hangupCall() {
    if (this.state.session) {
      this.state.session.terminate();
    } else if (this.state.incomingSession) {
      this.state.incomingSession.terminate();
    }
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


  handleRejectIncoming() {
    try {
      this.state.incomingSession.session.terminate({status_code: 486});
      this.varRemoteIsPlaying = false;
    } catch (error) {
      console.log('Session already finished');
    }
    this.clearSessions();
  }

  disconnect() {
    if (this._ua && (this.state.status === 'registered' || this.state.status === 'connected')) {
      console.log('*/*/*/*/*/*/*/*/*/*/  LEAVING WEBRTC  */*/*/*/*/*/*/*/*/*/');
      this._ua.unregister();
      delete this._ua;
    }

  }

  handleOutgoingCall(numb: any, option: string): boolean {

    if (this.state.status === 'Authentication Error' ||
        this.state.status === 'disconnected') {
        return false;
    }
    console.log(':::::::::::::::::::: OUTGOING CALL OPTIONS ::::::::::::::::::::');
    console.log(option);

    const session = (option === 'audio') ? this._ua.invite(numb, this.mediaOptions) : this._ua.invite(numb, this.mediaOptionsVideoChat);
    console.log(session);

    if (option === 'video') {
      this.offeredVideo = true;
    }

    // \\ progress // \\
    session.on('progress', (response: any) => {

      console.log(response);

      switch (response.reasonPhrase) {

        case "Session Progress":
          // alert('session progress');
          // this.setState({ session });
          // console.log(session);
          break;

        case "Trying":
          this.setState({ session });
          console.log(session);
          break;

        case "Ringing":
          // this.addStream(session);
          break;

        case "Accepted":
          alert('Accepted');
          break;

        case "Queued":
          alert('Queued');
          break;

        case "Bad Extension":
            alert('Bad Extension');
            break;

        case "Decline":
          alert('Decline');
          break;

        case "Request Pending":
          alert('Request Pending');
          break;

        case "OK":
          alert('OK');
          break;
      }
    });

    session.on('addStream', (stream) => {
      alert('addstream');
    });

    session.on('addTrack', (track) => {
      alert('addtrack');
    });

    session.on('replaced', (newSession) => {
      alert('replaced');
    });

    // \\ trackAdded // \\
    session.on('trackAdded', () => {
      // console.log(session);
      this.addStream(session);
    });

    // \\ accepted // \\
    session.on('accepted', () => {

      this.acceptedCall();

    });

    // \\ reinvite // \\
    session.on('reinvite', (_session: any) => {
      alert('reinvite');
      console.log(_session);
    });

    // \\ rejected // \\
    session.on('rejected', (response, cause) => {
      audioPlayer.play('rejected');
      this.varRemoteIsPlaying = false;
      alert("rejected: " + response + ":::" + cause);
    });

    // \\ failed // \\
    session.on('failed', (response, cause) => {
      this.varRemoteIsPlaying = false;
      alert("failed: " + response + ":::" + cause);
    });

    // \\ cancel // \\
    session.on('cancel', () => {
      // alert("cancel");
      audioPlayer.play('hangup');
      this.glob.outgoingSound.stop();
      this.varRemoteIsPlaying = false;
    });

    // \\ refer // \\
    session.on('refer', () => {
      // alert("refer");     // that's working
    });

    session.on('referRequested', (referServerContext) => {
      // alert('referRequested');
    });

    // \\ replaced // \\
    session.on('replaced', () => {
      alert("replaced");
    });

    // \\ dtmf // \\
    session.on('dtmf', (dtmf, request) => {
      // alert("dtmf");
      console.log(dtmf);
      console.log(request.tone);
      this.toneService.start(request.tone);
    });

    // \\ bye // \\
    session.on('bye', () => {
      console.log(":::::::::: Bye ::::::::::");
      this.terminatedCall();
    });

    // \\ terminated // \\
    session.on('terminated', (response, cause) => {
      console.log("terminated: " + response + ":::" + cause);
    });

    return true;
  }

  acceptedCall() {

    audioPlayer.play('answered');
    this.glob.outgoingSound.stop();
    this.glob.onCall = true;
    this.glob.showOutgoingcall = false;

    if (this.offeredVideo) {
      this.glob.globVideoChat = true;
      this.glob.showOncall = false;
      this.nativeWindow('btnDialpad').hidden = true;
      this.nativeWindow('btnHold').hidden = true;
      this.nativeWindow('btnMute').hidden = true;
      this.glob.globVideoStatus = 'Deactivate Video Chat';
    } else {
      this.glob.showOncall = true;
    }

  }

  terminatedCall() {
    this.removeSounds();
    this.clearSessions();
    this.glob.outgoingSound.stop();
    audioPlayer.play('hangup');

    this.glob.onCall = false;
    this.glob.showDialpad = false;
    this.glob.showOncall = false;
    this.varRemoteIsPlaying = false;
    this.glob.globVideoChat = false;
    this.glob.globHoldCall = false;
    this.offeredVideo = false;
    this.nativeWindow('btnDialpad').hidden = false;
    this.nativeWindow('btnHold').hidden = false;
    this.nativeWindow('btnMute').hidden = false;
    this.glob.globVideoStatus = 'Activate Video Chat';
    this.glob.globDtmfTrim = '';
  }

  addStream(varSess: any) {
    // this._audioElement = document.body.appendChild(document.createElement('audio'));
    // this._audioElement.srcObject = e.stream;
    // this._audioElement.play();

    // const pc: any = this.state.session.sessionDescriptionHandler.peerConnection;

    this.pc = varSess.sessionDescriptionHandler.peerConnection;

    // Gets remote tracks
    this.receivers = this.pc.getReceivers();
    if (this.receivers.length) {
      try {
    
        console.log(this.receivers);

        this.remoteStream = new MediaStream();
        this.receivers.forEach((receiver: any) => {
          this.remoteStream.addTrack(receiver.track);
        });

        if (this.nativeWindow('remoteVideo').srcObject) {
          this.nativeWindow('remoteVideo').pause();
        }
        this.nativeWindow('remoteVideo').srcObject = this.remoteStream;
        this.nativeWindow('remoteVideo').play();

      } catch (err) {
        console.log('error playing sound-video - Local - ', err );
      }
    }

    // Gets local tracks
    setTimeout(() => {

      this.senders = this.pc.getSenders();
      if (this.senders.length) {
        try {
          // const localStream = new MediaStream();
          this.localStream = new MediaStream();
          this.senders.forEach((sender: any) => {
            if (sender.track && sender.transport) {
                this.localStream.addTrack(sender.track);
            }
          });

          if (!this.nativeWindow('localVideo').srcObject) {
            this.nativeWindow('localVideo').pause();
          }
          this.nativeWindow('localVideo').srcObject = this.localStream;
          this.nativeWindow('localVideo').play();

        } catch (err) {

          console.log('error playing sound-video - Local - ', err );
        }
      }
    }, 500);

  }

  nativeWindow(id: any): any {
    return _window(id);
  }

  setState(newState: any) {
    console.log(newState);
    this.state = Object.assign({}, this.state, newState);
    return;
  }

  getState(state: any) {
    return this.state[state];
  }

  register() {
    if (this.state.status !== 'registered') {
      this._ua.register();
    }
  }

  unregister() {
    if (this.state.status === 'registered') {
      this._ua.unregister();
    }

  }

  setHoldOnCall() {
    if (!this.glob.globHoldCall) {
      this.state.session.hold(this.mediaOptions);
      this.glob.globHoldCall = true;
      this.glob.globCallHoldStatus = 'Resume Call';
    } else {
      this.state.session.unhold(this.mediaOptions);
      this.glob.globHoldCall = false;
      this.glob.globCallHoldStatus = 'Hold on Call';
    }
  }

  setMuteOnCall() {
    this.state.session.mute();
  }

  transferCall(phoneNumber: any, optAfterTransf: any) {
    // ||| \\ attended transfer seems not to be working  // ||| \\
    const opts = {
      activeAfterTransfer: true
    };

    this.state.session.refer(phoneNumber, opts);

  }

  sendDTMF(num: any) {

    this.glob.globDtmfTrim = this.glob.globDtmfTrim + num;
    this.state.session.dtmf(num);

  }

  /**
   * Set all sessions state to null
   */
  clearSessions() {
    this.setState({
      session: null,
      incomingSession: null
    });
  }

  /**
   * Stop all sounds and remove audio elements
  */
  removeSounds() {
    // If is ringing
    this.toneService.stopAll();

    // If is playing a message
    audioPlayer.stopAll();

    // If an audio element exist
    if (this._audioElement) {
        document.body.removeChild(this._audioElement);
        this._audioElement = null;
    }
  }










}
