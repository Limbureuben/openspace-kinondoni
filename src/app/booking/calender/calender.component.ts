import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingService } from '../../service/booking.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-calender',
  standalone: false,
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss'
})
export class CalenderComponent implements OnInit {
  calendarReady = false;

  calendarOptions: CalendarOptions = {
    // statically assign plugins here, since dynamic import causes viewType errors
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: this.handleEventTooltip.bind(this),
    height: 500,
  };

  constructor(
    private bookingService: BookingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.bookingService.getBookedSpaces().subscribe(bookings => {
        const groupedByDate: { [key: string]: any[] } = {};

        bookings.forEach(b => {
          if (!groupedByDate[b.date]) {
            groupedByDate[b.date] = [];
          }
          groupedByDate[b.date].push(b);
        });

        const events = Object.entries(groupedByDate).map(([date, bookingsOnDate]) => ({
          title: '',
          date,
          color: '#4CAF50',
          extendedProps: {
            bookings: bookingsOnDate
          }
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };

        this.calendarReady = true; // show calendar only after events load
      });
    }
  }

  handleEventClick(info: any) {
    const { start, extendedProps } = info.event;
    const bookings = extendedProps.bookings || [];

    const message = bookings.map((b: any, i: number) => (
      `${i + 1}. ${b.username} (Contact: ${b.contact}, Purpose: ${b.purpose})`
    )).join('\n');

    alert(
      `Bookings on ${start.toDateString()}:\n\n${message || 'No details available.'}`
    );
  }

  handleEventTooltip(info: any) {
    if (isPlatformBrowser(this.platformId)) {
      const tooltip = document.createElement('div');
      tooltip.innerHTML = 'Booked';
      tooltip.className = 'fc-tooltip';
      info.el.setAttribute('title', tooltip.textContent || '');
    }
  }
}
