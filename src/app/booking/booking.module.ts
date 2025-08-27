import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';
import { BookingHeaderComponent } from './booking-header/booking-header.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BookingMapComponent } from './booking-map/booking-map.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import { CalenderComponent } from './calender/calender.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';

import { MatBadgeModule } from '@angular/material/badge';



@NgModule({
  declarations: [
    BookingdashboardComponent,
    BookingHeaderComponent,
    BookingMapComponent,
    CalenderComponent,
    BookingHistoryComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    MatSelectModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDialogModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTableModule,
    FullCalendarModule,
    MatBadgeModule,
  ]
})
export class BookingModule { }
