import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreetRoutingModule } from './street-routing.module';
import { StreetSidebarComponent } from './street-sidebar/street-sidebar.component';
import { StreetCustomesidebarComponent } from './street-customesidebar/street-customesidebar.component';
import { StreetDashboardComponent } from './street-dashboard/street-dashboard.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { StreetReportsComponent } from './street-reports/street-reports.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { StreetDirectionComponent } from './street-direction/street-direction.component'
import { TrustedUrlPipe } from '../pipes/pipes/trusted-url.pipe';


@NgModule({
  declarations: [
    StreetSidebarComponent,
    StreetCustomesidebarComponent,
    StreetDashboardComponent,
    StreetReportsComponent,
    ReportDialogComponent,
    StreetDirectionComponent,
    TrustedUrlPipe
  ],
  imports: [
    CommonModule,
    StreetRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
  ]
})
export class StreetModule { }
