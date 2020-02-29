import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GetOrgStructure } from '../models/get-org-structure';
import { OrgStructure } from '../models/org-structure';
import { Globals } from '../globals';

import { Token } from '@angular/compiler';
import { EmailValidator } from '@angular/forms';
import { GetQueues } from '../main-nav/main-nav.component';

@Injectable({
  providedIn: 'root'
})
export class CallCenterService {

  glob: Globals;
  isLoggedIn = false;


  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router,
    glob: Globals
  ) {
    this.glob = glob;
  }


  getOrganizationStructure(token: Token, data: GetOrgStructure): Observable<GetOrgStructure[]> {
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token,
                                 'Content-Type': 'application/json ' + data })
    };
    const urlComplete = this.glob.apiURL + '/home/get/org-structure';
    return this.http.get<GetOrgStructure[]>(urlComplete, options);
  }

  saveOrganizationStructure(token: Token, data: OrgStructure): Observable<OrgStructure[]> {
    console.log(token);
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token,
                                 'body': 'form-data ' + data })
    };
    const urlComplete = this.glob.apiURL + '/home/save/org-structure';
    return this.http.post<OrgStructure[]>(urlComplete, data, options);
  }

  getQueues(token: Token, data: GetQueues): Observable<GetQueues[]> {
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token,
                                 'Content-Type': 'application/json ' + data })
    };
    const urlComplete = this.glob.apiURL + '/callcenter/get/queues';
    return this.http.get<GetQueues[]>(urlComplete, options);
  }


}
