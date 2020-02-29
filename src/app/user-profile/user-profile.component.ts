import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';
import { timer } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  glob: Globals;

  constructor(
    private authUser: AuthService,
    private sipJs: SipjsService,
    glob: Globals) {
      this.glob = glob;
  }
  ngOnInit() {
  }



  logout() {
    
    this.authUser.logout();

  }


}
