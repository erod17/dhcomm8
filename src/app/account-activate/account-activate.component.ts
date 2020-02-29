import { CommonModule } from '@angular/common';
import { Input, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

declare function vertoInit(): any;

@Component({
  selector: 'app-account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css']
})
export class AccountActivateComponent implements OnInit {

  email: string;
  activateMsg: any;
  showError = false;
  showSuccess = false;
  userActiveData = {};

  userToken = {};
  userInfo = {};

  activateForm = new FormGroup({
    password: new FormControl(''),
    confirm: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private paramRoute: ActivatedRoute,
    private authUser: AuthService
  ) { }

  activateAlertClosed = true;

  ngOnInit(): void {
    setTimeout(() => this.activateAlertClosed = true, 1000);

    this.activateForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      confirm: [''],

    }, {validator: this.matchPassword });

    this.email = this.paramRoute.snapshot.params.email;

    console.log(this.email);
  }

  matchPassword(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirm').value;

    if (pass !== confirmPass) {
      console.log('false');
      group.get('confirm').setErrors({ MatchPassword: true });
    } else {
      console.log('true');
      return null;
    }
  }


  onSubmit() {
    if (this.activateForm.invalid) {
      return;
    }
    const activatePayload = {
      password: this.activateForm.controls.password.value,
      username: this.email
    };

    this.authUser.accountActivate(activatePayload).subscribe((data: any) => {
      if (data.code === '200') {
        this.showError = false;
        this.showSuccess = true;
        this.activateMsg = data.message;
        this.userActiveData = data.data.user;

      } else {
        this.showError = true;
        this.showSuccess = false;
        this.activateMsg = data.message;
        this.activateAlertClosed = false;
      }
    },  err => {

      if (err.status === 401) {
        console.log(err.status);
        this.activateAlertClosed = false;
      }
    });
  }


  navToLogin() {
    this.router.navigate(['login']);
  }


}
