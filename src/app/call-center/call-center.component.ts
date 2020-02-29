import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../globals';

@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.css']
})
export class CallCenterComponent implements OnInit {

  varCallCenterUUID: string;
  glob: Globals;
  varToken: any;

  callCenterForm = new FormGroup({
    queueName: new FormControl('')
    
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private paramRoute: ActivatedRoute,
    glob: Globals
  ) {
    this.glob = glob;
    this.varToken = window.localStorage.getItem('token');
  }

  ngOnInit() {

    this.varCallCenterUUID = this.paramRoute.snapshot.params.id;
    
  }

}
