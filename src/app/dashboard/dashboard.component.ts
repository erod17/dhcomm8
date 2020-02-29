import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SipjsService } from '../services/sipjs.service';
import { Globals } from '../globals';
import { Token } from '@angular/compiler';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  model: any = {};
  varUserContacts = {};
  glob: Globals;
  varToken: any;

  dataFromServer: any = [];
  // rstUserInfo: any = {};


  constructor(
    private authService: AuthService,
    private authUser: AuthService,
    private sipJs: SipjsService,
    glob: Globals
  ) {
      this.glob = glob;
      // this.glob.userIn = this.authUser.isAuthenticated();
      // this.rstUserInfo = JSON.parse(window.localStorage.getItem('userInfo'));

      // if (this.rstUserInfo) {
        
      //   this.getContacts();

      // }
    }

  // getContacts() {

  //   this.varToken = window.localStorage.getItem('token');
  //   this.authUser.getUserContacts(this.varToken)
  //     .subscribe((data: any) => {
  //       if (data.code === '200') {
  //         this.varUserContacts = data.data;
  //         this.varUserContacts = Array.of(this.varUserContacts);
  //         window.localStorage.setItem('userContacts', JSON.stringify(this.varUserContacts));
  //         this.glob.globContacts = JSON.parse(window.localStorage.getItem('userContacts'))[0];
  //         console.log(this.glob.globContacts);
  //       }
  //     }, err => {

  //       if (err.status === 401) {
  //         console.log('*************** E R R O R  **************');
  //         console.log(err.status);
  //       }
  //   });

  // }  

  ngOnInit() {
    // setTimeout(() => {
    //   window.location.reload();
    // }, 300000); // Activate after 5 minutes.

  }

  getSomePrivateStuff() {
    this.model.action = 'stuff';
    this.authService.getUserInfo(this.model).subscribe(response => {
       console.log('erik');
    }, error => {
      this.authService.logout();
    });
  }


}
