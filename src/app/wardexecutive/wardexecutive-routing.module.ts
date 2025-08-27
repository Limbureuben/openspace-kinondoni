import { WardSidebarComponent } from './ward-sidebar/ward-sidebar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';
import { authGuard } from '../guards/auth.guard';
import { WardBookingComponent } from './ward-booking/ward-booking.component';
import { ManageChairComponent } from './manage-chair/manage-chair.component';
import { AvailableReportComponent } from './available-report/available-report.component';

const routes: Routes = [
   {
      path: 'executive',
      component: WardSidebarComponent,
      canActivate: [authGuard],
      children: [
        { path: 'ward-bookings', component: WardBookingComponent },
        { path: 'ward-dashboard', component: WarddashboardComponent },
        { path: 'manage-chair', component: ManageChairComponent },
        { path: 'available-report', component: AvailableReportComponent },
        { path: '', redirectTo: 'ward-bookings', pathMatch: 'full'}
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardexecutiveRoutingModule { }
