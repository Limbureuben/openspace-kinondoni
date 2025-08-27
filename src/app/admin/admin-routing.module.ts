import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapCommonComponent } from './map-common/map-common.component';
import { AvailablespaceComponent } from './availablespace/availablespace.component';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
import { adminExitGuard } from '../guards/admin-exist.guard';
import { AvailablereportComponent } from './availablereport/availablereport.component';
import { ReportHistoryComponent } from './report-history/report-history.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashComponent } from './dash/dash.component';
import { ReportUssdComponent } from './report-ussd/report-ussd.component';
import { ManagewardexecutiveComponent } from './Book/managewardexecutive/managewardexecutive.component';
import { AvailableBookingComponent } from './Book/available-booking/available-booking.component';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { RegisterWardsComponent } from './wards-streets/register-wards/register-wards.component';

const routes: Routes = [
  {
    path: 'admin',
    component: SidebarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dash', component: DashComponent },
      { path: 'map-common', component: MapCommonComponent },
      { path: 'openspace', component: AvailablespaceComponent },
      { path: 'reports', component: AvailablereportComponent },
      { path: 'history', component: ReportHistoryComponent },
      { path: 'report-ussd', component: ReportUssdComponent },
      { path: 'manage-wardexecutive', component: ManagewardexecutiveComponent },
      { path: 'booking', component: AvailableBookingComponent },
      { path: 'all-report', component: AllReportsComponent },
      { path: 'register-wards', component: RegisterWardsComponent },
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
