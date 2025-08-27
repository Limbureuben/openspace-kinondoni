import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { authGuard } from '../guards/auth.guard';
import { noTokenGuard } from '../guards/no-token.guard';
import { adminExitGuard } from '../guards/admin-exist.guard';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: 'user-home', component: UserHomeComponent, canActivate: [noTokenGuard] },
  { path: 'user-dashboard', component: UserDashboardComponent},
  { path: 'map-display', component: MapDisplayComponent, canActivate: [authGuard] },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'map', component: MapComponent },
  { path: 'viewhistory', component: ViewHistoryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'reset-password/:uid/:token',
    component: ResetPasswordComponent,
    data: { renderMode: 'csr' }
  },

  // { path: 'reset-password/:uid/:token', component: ResetPasswordComponent, data: { renderMode: 'csr' } },
  { path: 'password-reset', component: PasswordResetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
