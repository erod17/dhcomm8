import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserCredentials } from '../models/user-credentials';
import { UserInfo } from '../models/user-info';
import { UserContactsInfo } from '../models/user-contacts-info';
import { Messages } from '../models/messages';
import { SignupInfo } from '../models/signup-info';
import { Globals } from '../globals';

import { Token } from '@angular/compiler';
import { EmailValidator } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  glob: Globals;
  isLoggedIn = false;
  redirectUrl: string;


  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router,
    glob: Globals
  ) {
    this.glob = glob;
  }


  userLogin(credentials: UserCredentials): Observable<UserCredentials[]> {
    const urlComplete = this.glob.apiURL + '/api/login';
    this.isLoggedIn = true;
    return this.http.post<UserCredentials[]>(urlComplete, credentials);
  }

  updateUserStatus(token: Token): Observable<[]> {
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    };
    const urlComplete = this.glob.apiURL + '/user/updatestatus';
    return this.http.post<[]>(urlComplete, options);
  }

  getUserInfo(token: Token): Observable<UserInfo[]> {
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    };
    const urlComplete = this.glob.apiURL + '/user/get/info';
    return this.http.get<UserInfo[]>(urlComplete, options);
  }

  getUserContacts(token: Token): Observable<UserContactsInfo[]> {
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    };
    const urlComplete = this.glob.apiURL + '/user/get/contacts';
    return this.http.get<UserContactsInfo[]>(urlComplete, options);
  }

  public get loggedIn(): boolean {
    console.log('Check wheter or not is logged....');
    return window.localStorage.getItem('token') !==  null;
  }

  public isAuthenticated(): boolean {
    console.log('Check wheter or not is logged....');
    const token = window.localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    this.glob.userIn = false;
    this.router.navigate(['login']);
  }

  passwordResetSendEmail(email: Messages): Observable<Messages[]> {
    const options = {
      headers: new HttpHeaders({ 'body': 'form-data ' + email })
    };
    const urlComplete = this.glob.apiURL + '/api/password/reset/send-email';
    return this.http.post<Messages[]>(urlComplete, email);
  }

  userSignup(data: SignupInfo): Observable<SignupInfo[]> {
    const options = {
      headers: new HttpHeaders({ 'body': 'form-data ' + data })
    };
    const urlComplete = this.glob.apiURL + '/api/user/signup';
    return this.http.post<SignupInfo[]>(urlComplete, data);
  }

  accountActivate(data: UserCredentials): Observable<UserCredentials[]> {
    const urlComplete = this.glob.apiURL + '/api/account/activate';
    return this.http.post<UserCredentials[]>(urlComplete, data);
  }



}
