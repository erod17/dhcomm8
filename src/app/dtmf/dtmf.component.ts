import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-dtmf',
  templateUrl: './dtmf.component.html',
  styleUrls: ['./dtmf.component.css']
})
export class DtmfComponent implements OnInit {

  glob: Globals;

  constructor(
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
  }

  ngOnInit() {
  }

  setDtmf(val: any) {
    this.sipJs.sendDTMF(val);
  }

}
