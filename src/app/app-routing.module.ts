import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './sharing/header/header.component';
import { FooterComponent } from './sharing/footer/footer.component';
import { UserHeaderComponent } from './user/user-header/user-header.component';
import { MapComponent } from './user/map/map.component';
import { ReportFormComponent } from './user/report-form/report-form.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { CommonHeaderComponent } from './sharing/common-header/common-header.component';
import { MapAdminComponent } from './admin/map-admin/map-admin.component';
import { CustomerSidebarComponent } from './admin/customer-sidebar/customer-sidebar.component';
import { WardCustomersidebarComponent } from './wardexecutive/ward-customersidebar/ward-customersidebar.component';
import { BookingHeaderComponent } from './booking/booking-header/booking-header.component';
import { AvailableBookingComponent } from './wardexecutive/available-booking/available-booking.component';
import { ReportUssdComponent } from './admin/report-ussd/report-ussd.component';
import { AvailablereportComponent } from './admin/availablereport/availablereport.component';
import { StreetCustomesidebarComponent } from './street/street-customesidebar/street-customesidebar.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-home', pathMatch: 'full'},
  {
    path: 'app',
    component: HeaderComponent,
    loadChildren:() =>
      import('./sharing/sharing.module').then((m) => m.SharingModule),
  },
  {
    path: 'app',
    component: FooterComponent,
    loadChildren: () =>
      import('./sharing/sharing.module').then((m)=>m.SharingModule)
  },
  {
    path: 'app',
    component: UserHeaderComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  },
  {
    path: 'app',
    component: UserHeaderComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  },
  {
    path: 'app',
    component: MapComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  },
  {
    path: 'app',
    component: ReportFormComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  },
  {
    path: 'app',
    component: AdminFooterComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path: 'app',
    component: CommonHeaderComponent,
    loadChildren: () =>
      import('./sharing/sharing.module').then((m) =>m.SharingModule)
  },
  {
    path: 'app',
    component: MapAdminComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path:'app',
    component: CustomerSidebarComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path: 'app',
    component: WardCustomersidebarComponent,
    loadChildren: () =>
      import('./wardexecutive/wardexecutive.module').then((m) =>m.WardexecutiveModule)
  },
  {
    path: 'app',
    component: BookingHeaderComponent,
    loadChildren: () =>
      import('./booking/booking.module').then((m) =>m.BookingModule)
  },
  {
    path: 'app',
    component: AvailablereportComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },

  {
    path: 'app',
    component: ReportUssdComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path: 'app',
    component: StreetCustomesidebarComponent,
    loadChildren: () =>
      import('./street/street.module').then((m) =>m.StreetModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
