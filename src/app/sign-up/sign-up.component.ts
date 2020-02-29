import { CommonModule } from '@angular/common';
import { Input, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../globals';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  signupMsg: any;
  showError = false;
  showSuccess = false;
  glob: Globals;
  urlClient = '/account-activate';

  signupForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    companyName: new FormControl(''),
    phoneNumber: new FormControl(''),
    zipCode: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authUser: AuthService,
    glob: Globals
  ) {
    this.glob = glob;
  }

  signupAlertClosed = true;

  ngOnInit(): void {
    setTimeout(() => this.signupAlertClosed = true, 1000);

    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      companyName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      zipCode: ['', Validators.required]

    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    const signupPayload = {
      firstName: this.signupForm.controls.firstName.value,
      lastName: this.signupForm.controls.lastName.value,
      email: this.signupForm.controls.email.value,
      companyName: this.signupForm.controls.companyName.value,
      phoneNumber: this.signupForm.controls.phoneNumber.value,
      zipCode: this.signupForm.controls.zipCode.value,
      urlClient: this.glob.apiURL + this.urlClient
    };

    this.authUser.userSignup(signupPayload).subscribe((data: any) => {
      console.log(data);

      if (data.code === '200') {
        this.showError = false;
        this.showSuccess = true;
        this.signupMsg = data.message;

      } else {
        this.showError = true;
        this.showSuccess = false;
        this.signupMsg = data.message;    //'Please check all values required for this request'
        this.signupAlertClosed = false;
      }
    },  err => {

      if (err.status === 401) {
        console.log(err.status);
        this.signupAlertClosed = false;
      }
    });
  }

  navToLogin() {
    this.router.navigate(['login']);
  }



}
