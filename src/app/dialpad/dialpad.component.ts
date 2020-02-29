import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';


@Component({
  selector: 'app-dialpad',
  templateUrl: './dialpad.component.html',
  styleUrls: ['./dialpad.component.css']
})
export class DialpadComponent implements OnInit {

  glob: Globals;
  calling: string;
  varContacts = [];
  varContact = [];
  dialpadForm: FormGroup;
  showBkSpce = false;

  constructor(
    private formBuilder: FormBuilder,
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
  }

  ngOnInit() {

    this.dialpadForm = this.formBuilder.group({
      phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(11)])]
    });

  }

  
  makeCall(opt: string) {

    if (this.dialpadForm.invalid) {
      return;
    }
    const phoNumb = this.dialpadForm.controls.phoneNumber.value;

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

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }

    if (this.dialpadForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
  }

  changeCallNumber() {
    this.glob.outgoingNumber = this.dialpadForm.controls.phoneNumber.value;
    if (this.dialpadForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
  }

  backSpacePhoneNumber() {
    this.dialpadForm.controls['phoneNumber'].setValue(this.dialpadForm.controls.phoneNumber.value.substr(0, this.dialpadForm.controls.phoneNumber.value.length - 1));
    this.glob.outgoingNumber = this.dialpadForm.controls.phoneNumber.value;
    if (this.dialpadForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
  }

  switchVideocall() {
    this.glob.globVideoChat = !this.glob.globVideoChat;
  }

  getTone(val: any) {

    this.dialpadForm.controls['phoneNumber'].setValue(this.dialpadForm.controls.phoneNumber.value + val);
    this.glob.outgoingNumber = this.dialpadForm.controls.phoneNumber.value;
    if (this.dialpadForm.controls.phoneNumber.value.length === 0) {
      this.showBkSpce = false;
    } else {
      this.showBkSpce = true;
    }
    this.sipJs.toneService.start(val);
  }

}
