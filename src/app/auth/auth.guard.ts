import { Injectable } from '@angular/core';
import { CanActivate,
         CanActivateChild,
         CanLoad,
         Route,
         Router,
         UrlSegment,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import * as JWT from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
        private authService: AuthService,
        private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthGuard # canActivate called');
    const url: string = state.url;
console.log(url);
    const expectedRole = route.data.expectedRole;
console.log( expectedRole);
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JWT(token);
console.log(tokenPayload['role']);
      if (this.checkLogin(url)) {

        if (expectedRole === 'user' || expectedRole === 'public') { return true; }
        if ((expectedRole === 'admin' || expectedRole === 'superadmin') && expectedRole === tokenPayload[ 'role' ]) { return true; }
        this.router.navigate(['login']);
        return false;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  checkLogin(url: string): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }





  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    console.log('canActivateChild');
    return this.canActivate(route, state);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
