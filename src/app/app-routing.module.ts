import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccountActivateComponent } from './account-activate/account-activate.component';
import { OrgStructureComponent } from './org-structure/org-structure.component';
import { CallCenterComponent } from './call-center/call-center.component';

const appRoutes: Routes = [
  // { path: '', component: AppComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'account-activate/:email', component: AccountActivateComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
    runGuardsAndResolvers: 'always'
  },
  { path: 'org-structure',
    component: OrgStructureComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
    runGuardsAndResolvers: 'always'
  },
  { path: 'call-center/:id',
    component: CallCenterComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
    runGuardsAndResolvers: 'always'
  },
  // { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  // { path: 'resellers', loadChildren: './vvpusa/vvpusa.module#VvpusaModule' },
  { path: '**', component: PageNotFoundComponent }
];

console.log(window.location.origin);

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
