import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreetSidebarComponent } from './street-sidebar/street-sidebar.component';
import { authGuard } from '../guards/auth.guard';
import { StreetDashboardComponent } from './street-dashboard/street-dashboard.component';
import { StreetReportsComponent } from './street-reports/street-reports.component';

const routes: Routes = [
  { 
    path: 'street',
      component: StreetSidebarComponent,
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: StreetDashboardComponent },
        { path: 'reports',component: StreetReportsComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreetRoutingModule { }
