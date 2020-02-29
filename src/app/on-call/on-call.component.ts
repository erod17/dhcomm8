import { Component, OnInit } from '@angular/core';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';


@Component({
  selector: 'app-on-call',
  templateUrl: './on-call.component.html',
  styleUrls: ['./on-call.component.css']
})
export class OnCallComponent implements OnInit {

  glob: Globals;

  constructor(
    private sipJs: SipjsService,
    glob: Globals
  ) {
    this.glob = glob;
   }


  ngOnInit() {

  }
  

}
