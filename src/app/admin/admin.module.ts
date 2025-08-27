import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapCommonComponent } from './map-common/map-common.component';
import { MapComponent } from '../user/map/map.component';
import { MapDisplayComponent } from '../user/map-display/map-display.component';
import { SharingModule } from '../sharing/sharing.module';
import { MapAdminComponent } from './map-admin/map-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailablespaceComponent } from './availablespace/availablespace.component';
import { MatTableModule } from '@angular/material/table';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { openSpaceReducer } from '../State/open-space.reducer';
import { OpenspaceService } from '../service/openspace.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvailablereportComponent } from './availablereport/availablereport.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportHistoryComponent } from './report-history/report-history.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CustomerSidebarComponent } from './customer-sidebar/customer-sidebar.component';
import { DashComponent } from './dash/dash.component';
import { ReportUssdComponent } from './report-ussd/report-ussd.component';
import { RegisterWardComponent } from './Book/register-ward/register-ward.component';
import { ManagewardexecutiveComponent } from './Book/managewardexecutive/managewardexecutive.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AvailableBookingComponent } from './Book/available-booking/available-booking.component';
import { ViewbookigComponent } from './Book/viewbookig/viewbookig.component';
import { ReplyComponent } from './reply/reply.component';
import { NotificationComponent } from './Book/notification/notification.component';
import { NotificationSingleComponent } from './Book/notification-single/notification-single.component';
import { MapDirectionComponent } from './map-direction/map-direction.component';
import { SafeUrlPipe } from '../pipes/pipes/safe-url.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { ReplyBookingComponent } from './Book/reply-booking/reply-booking.component';
import { RegisterWardsComponent } from './wards-streets/register-wards/register-wards.component';
import { WardsRegisterComponent } from './wards-streets/wards-register/wards-register.component';



@NgModule({
  declarations: [
    AdminFooterComponent,
    MapCommonComponent,
    MapAdminComponent,
    AvailablespaceComponent,
    AvailablereportComponent,
    ViewReportComponent,
    ReportHistoryComponent,
    SidebarComponent,
    CustomerSidebarComponent,
    DashComponent,
    ReportUssdComponent,
    RegisterWardComponent,
    ManagewardexecutiveComponent,
    AvailableBookingComponent,
    ViewbookigComponent,
    ReplyComponent,
    NotificationComponent,
    NotificationSingleComponent,
    MapDirectionComponent,
    SafeUrlPipe,
    AllReportsComponent,
    ReplyBookingComponent,
    RegisterWardsComponent,
    WardsRegisterComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    UserModule,
    SharingModule,
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    StoreModule.forFeature('openSpace', openSpaceReducer),
  ],
})
export class AdminModule { }
