import { Component, OnInit } from '@angular/core';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

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
