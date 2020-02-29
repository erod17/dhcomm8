import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  msgReturned = {};
  msgAlertClosed = true;

  resetForm = new FormGroup({
    email: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authUser: AuthService
  ) { }


  ngOnInit() {

    setTimeout(() => this.msgAlertClosed = true, 1000);

    this.resetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])]
    });


  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const resetPayload = {
      email: this.resetForm.controls.email.value
    };

    this.authUser.passwordResetSendEmail(resetPayload).subscribe((data) => {
      if (data) {
        this.msgReturned = data;
        this.msgReturned = Array.of(this.msgReturned);

        // aqui estamos //
        console.log(this.msgReturned);

        if (this.msgReturned[0].success) {
          this.router.navigate(['login']);
        } else {
          console.log('Error ===>  ' + this.msgReturned[0].error.message);
          this.msgAlertClosed = false;
        }
      }
    },  err => {

      if (err.status === 401) {
        console.log(err.status);
        this.msgAlertClosed = false;
      }
    }
    );
  }


}
