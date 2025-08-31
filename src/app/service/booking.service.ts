import { Injectable } from '@angular/core';
import { GET_ALL_EXECUTIVE, GET_BOOKED_SPACES, GET_MY_STREET_LEADER, REGISTER_USER } from '../graphql';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterData, User } from '../models/openspace.model';
import { Apollo } from 'apollo-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private resetUrl = 'http://localhost:8000';

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
      const sessionId = localStorage.getItem('sessionId');

      return this.apollo.mutate({
        mutation: REGISTER_USER,
        variables: {
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
          username: userData.username,
          sessionId: sessionId ? sessionId : null
        }
      });
    }

    getAllExecutives(): Observable<any> {
      return this.apollo.watchQuery<any>({
        query: GET_ALL_EXECUTIVE
      }).valueChanges.pipe(map(result => result.data.wardExectives))
    }

    getAllStreetLeaders(): Observable<User[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
      return this.http.get<User[]>(`${this.resetUrl}/api/v1/street-leaders/`, { headers });
    }


    bookOpenSpace(data: FormData): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.resetUrl}/api/v1/book-open-space/`, data, { headers });
    }

    getAllBookings() {

    }

    getBookedSpaces() {
    return this.apollo
      .watchQuery<any>({
        query: GET_BOOKED_SPACES
      })
      .valueChanges.pipe(
        map(result => result.data.bookedOpenspace)
      );
  }

  getBookingsByDistrict(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.resetUrl}/api/v1/district-bookings/`, { headers });
  }

  getReportsByDistrict(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.resetUrl}/api/v1/reports/forwarded/`, { headers });
  }


  getReportsByStreet(): Observable<Report[]> {
    const token = localStorage.getItem('token'); // or wherever you store JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Report[]>(`${this.resetUrl}/api/v1/street-reports/`, { headers });
  }



  getStreetReports(): Observable<Report[]> {
    const token = localStorage.getItem('token'); // or wherever you store JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Report[]>(`${this.resetUrl}/api/v1/street-reports/`, { headers });
  }

  acceptBooking(bookingId: number, description: string): Observable<any> {
  const payload = { description };
  const url = `http://localhost:8000/api/v1/accept-and-forward-booking/${bookingId}/`;
  return this.http.post(url, payload);
}

getAdminBookingsByDistrict(): Observable<any> {
   const token = localStorage.getItem('token');
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.get(`${this.resetUrl}/api/v1/allbooking/`, { headers });
}

  rejectBooking(bookingId: number): Observable<any> {
      const url = `${this.resetUrl}/api/v1/bookings/${bookingId}/reject/`;
      return this.http.post(url, {}); // POST with empty body
    }

  getAllMyBookings(): Observable<any> {
    return this.http.get(`${this.resetUrl}/api/v1/my-bookings/`);
  }

  getAllMyHistoryBooking(): Observable<any> {
    return this.http.get(`${this.resetUrl}/api/v1/my-bookings`);
  }


  replyToReport(reportId: number, message: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.resetUrl}/api/v1/reports/reply/${reportId}/`, { message }, { headers });
  }

  deleteReport(reportId: number) {
    return this.http.delete(`${this.resetUrl}/api/v1/delete-report/${reportId}/`);
  }

    sendReply(reportId: string, message: string) {
    return this.http.post(`${this.resetUrl}/api/reports/reply/`, {
      report_id: reportId,
      message: message
    });
  }

  deleteBooking(bookingId: number) {
    return this.http.delete(`${this.resetUrl}/api/v1/bookings/${bookingId}/delete/`);
  }

  acceptNewBooking(bookingId: number): Observable<any> {
    const url = `${this.resetUrl}/api/v1/bookings/${bookingId}/accept/`;
    return this.http.post(url, {});
  }

  getUserBookingStats(): Observable<any> {
  return this.http.get(`${this.resetUrl}/api/v1/user-booking-stats/`);
}

sendNotificationToAllWardExecutives(message: string) {
  return this.http.post(`${this.resetUrl}/api/v1/notify-ward-executives/`, { message})
}

sendNotificationToWardExecutive(email: string, message: string) {
  return this.http.post(`${this.resetUrl}/api/v1/notify-single-ward-executive/`, { email, message });
}

  getAllMyHistoryReporting(): Observable<any> {
    return this.http.get(`${this.resetUrl}/api/v1/user-reports/`);
  }

  deleteMyBooking(id: number): Observable<any> {
    return this.http.delete(`${this.resetUrl}/api/v1/delete-booking/${id}/`);
  }

  sendNotification(userId: number, message: string): Observable<any> {
    return this.http.post(`${this.resetUrl}/api/v1/send-notification/`, {
      user_id: userId,
      message: message
    },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getUnreadCount(): Observable<number> {
  return this.http.get<{ unread_count: number }>(`${this.resetUrl}/api/v1/notifications/unread-count/`)
    .pipe(
      map(response => response.unread_count || 0)
    );
}


forwardReportToAdmin(forwardId: number, message: string = ''): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const payload = { message };
  console.log('Forwarding report to admin...');
  console.log('Forward ID:', forwardId);
  console.log('Payload:', payload);
  console.log('POST URL:', `${this.resetUrl}/api/v1/reports/${forwardId}/forward-to-admin/`);

  return this.http.post(
    `${this.resetUrl}/api/v1/reports/${forwardId}/forward-to-admin/`,
    { message },
    { headers }
  ).pipe(
    catchError(error => {
      console.error('Error forwarding report to admin:', error);
      return throwError(() => error);
    })
  );
}



}


