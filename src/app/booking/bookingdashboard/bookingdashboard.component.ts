import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../service/booking.service';
import { error } from 'console';

@Component({
  selector: 'app-bookingdashboard',
  standalone: false,
  templateUrl: './bookingdashboard.component.html',
  styleUrl: './bookingdashboard.component.scss',
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.dashboard-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BookingdashboardComponent implements OnInit {

    bookingStats = { total: 0, accepted: 0, pending: 0 };
    bookings: any[] = [];
    displayedColumns: string[] = ['username', 'startdate', 'enddate', 'purpose', 'status'];

    constructor(
      private router: Router,
      private toastr: ToastrService,
      private mybooking: BookingService
    ) {}

    ngOnInit(): void {
      this.loadmyBooking();
      this.loadBookingNumber();
    }

    loadmyBooking() {
      this.mybooking.getAllMyBookings().subscribe({
        next: (data) => {
          const bookings = data.results ? data.results : data;
          this.bookings = bookings.slice(0, 3);

          console.log('5 most recent bookings:', this.bookings);
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
        }
      });
    }

    loadBookingNumber() {
      this.mybooking.getUserBookingStats().subscribe(data => {
        this.bookingStats = data;
      });
    }

    deleteBooking(id: any) {

    }
}
