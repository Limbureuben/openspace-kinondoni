import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ADD_OPENSPACE, CONFIRM_REPORT, CREATE_REPORT, DELETE_OPEN_SPACE, GET_ALL_HISTORY, GET_ALL_OPENSPACES, GET_ALL_OPENSPACES_ADMIN, GET_ALL_OPENSPACES_USER, GET_ALL_REPORT_USSD, GET_ALL_REPORTS, GET_ANONYMOUS_REPORTS, GET_HISTORY_COUNT, GET_MY_REPORTS, GET_OPENSPACE_COUNT, GET_REPORT_COUNT, REGISTER_REPORT_MUTATION, TOGGLE_OPENSPACE_STATUS } from '../graphql';
import { OpenSpaceRegisterData, ToggleOpenSpaceResponse } from '../models/openspace.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export type { OpenSpaceRegisterData, ToggleOpenSpaceResponse };


@Injectable({
  providedIn: 'root'
})
export class OpenspaceService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/upload/';
  private confirmReportUrl = 'http://127.0.0.1:8000/api/v1/confirm-report/';
  private resetUrl = 'http://127.0.0.1:8000/api/v1';
  private openSpacesSubject = new BehaviorSubject<any[]>([]);
  openSpaces$ = this.openSpacesSubject.asObservable();

  constructor(private apollo: Apollo, private http: HttpClient,) {
    this.loadOpenSpaces();
  }

  addSpace(openData: OpenSpaceRegisterData): Observable<any> {
    return this.apollo.mutate<{ addOpenSpace: { openspace: any } }>({
      mutation: ADD_OPENSPACE,
      variables: {
        name: openData.name,
        latitude: openData.latitude,
        longitude: openData.longitude,
        district: openData.district,
        street: openData.street,
      },
      refetchQueries: [
        { query: GET_ALL_OPENSPACES_ADMIN },
        { query: GET_OPENSPACE_COUNT }
      ]
    });
  }

  getAllOpenSpacesUser(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ allOpenSpacesUser: any[] }>({
        query: GET_ALL_OPENSPACES_USER,
      })
      .valueChanges.pipe(map((result) => result.data.allOpenSpacesUser));
  }

  getAllOpenSpacesAdmin(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ allOpenSpacesAdmin: any[] }>({
        query: GET_ALL_OPENSPACES_ADMIN,
      })
      .valueChanges.pipe(map((result) => result.data.allOpenSpacesAdmin));
  }

  loadOpenSpaces() {
    this.apollo.watchQuery({ query: GET_ALL_OPENSPACES_ADMIN }).valueChanges.pipe(
      map((result: any) => result.data.allOpenSpacesAdmin)
    ).subscribe((data) => {
      this.openSpacesSubject.next(data);
    });
  }

  getOpenSpaces(): Observable<any[]> {
    return this.apollo.watchQuery<{ allOpenSpacesAdmin: any[] }>({
      query: GET_ALL_OPENSPACES_ADMIN,
    })
    .valueChanges.pipe(map(result => result.data.allOpenSpacesAdmin));
  }

  deleteOpenSpace(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_OPEN_SPACE,
      variables: { id },
      update: (cache) => {
        // Update the list of open spaces
        const existingData: any = cache.readQuery({ query: GET_ALL_OPENSPACES_ADMIN });
        if (existingData) {
          cache.writeQuery({
            query: GET_ALL_OPENSPACES_ADMIN,
            data: {
              allOpenSpacesAdmin: existingData.allOpenSpacesAdmin.filter((space: any) => space.id !== id),
            },
          });
        }
        // Update the open space count
        const existingCountData: any = cache.readQuery({ query: GET_OPENSPACE_COUNT });
        if (existingCountData) {
          cache.writeQuery({
            query: GET_OPENSPACE_COUNT,
            data: {
              totalOpenspaces: Math.max(0, existingCountData.totalOpenspaces - 1), // Decrease count
            },
          });
        }
      },
    });
  }


  getOpenspaceCount(): Observable<any> {
    return this.apollo.watchQuery<{ totalOpenspaces: number }>({
      query: GET_OPENSPACE_COUNT,
    }).valueChanges;
  }

  toggleOpenSpaceStatus(id: string, isActive: boolean): Observable<any> {
    return this.apollo.mutate<ToggleOpenSpaceResponse>({
      mutation: TOGGLE_OPENSPACE_STATUS,
      variables: { input: { id, isActive } }
    }).pipe(
      map(result => result.data?.toggleOpenspaceStatus?.openspace)
    );
  }

  registerReport(description: string, email: string): Observable<any> {
    const sessionId = localStorage.getItem('session_id');
    return this.apollo.mutate({
      mutation: REGISTER_REPORT_MUTATION,
      variables: { description, email, sessionId}
    });
  }

  uploadFile(file: File | null): Observable<{ file_path: string | null }> {
    if (!file) {
      return of({ file_path: null });
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ file_path: string }>(this.apiUrl, formData);
  }


  createReport(description: string, email: string | null, filePath: string | null, spaceName: string, district: string, street: string, latitude: number, longitude: number, userId: string | null): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_REPORT,
      variables: {
        description,
        email: email || null,
        userId,
        filePath: filePath || null,
        spaceName,
        district,
        street,
        latitude,
        longitude
      }
    }).pipe(
      map(result => result.data)
    );
  }


  getAllReports(): Observable<any[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.resetUrl}/reports/forwarded-to-admin/`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching forwarded reports for admin:', error);
          return throwError(() => error);
        })
      );
  }


  getRecentReports(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_REPORTS,
    }).valueChanges.pipe(map(result => result.data.allReports));
  }


  getAllHistory(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_HISTORY,
    }).valueChanges.pipe(map(result =>result.data.allHistorys))
  }


  confirmReport(reportId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CONFIRM_REPORT,
      variables: { reportId },
      refetchQueries: [{ query: GET_ALL_HISTORY }], // Fetch updated history
      update: (cache) => {
        // Update GET_ALL_REPORTS cache to remove confirmed report
        const existingData: any = cache.readQuery({ query: GET_ALL_REPORTS });

        if (existingData) {
          cache.writeQuery({
            query: GET_ALL_REPORTS,
            data: {
              allReports: existingData.allReports.filter(
                (report: any) => report.reportId !== reportId
              ),
            },
          });
        }
      },
    });
  }


  getAllHistoryReport(): Observable<any> {
    return this.apollo.watchQuery<{ totalHistorys: number }> ({
      query: GET_HISTORY_COUNT,
    }).valueChanges;
  }

  getAllReportPending(): Observable<any> {
    return this.apollo.watchQuery<{ totalReport: number }> ({
      query: GET_REPORT_COUNT,
    }).valueChanges;
  }

  getAnonymousReports(sessionId: string) {
    return this.apollo.watchQuery({
      query: GET_ANONYMOUS_REPORTS,
      variables: { sessionId }
    }).valueChanges;
  }

getMyReports(): Observable<any> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('success_token') : null; // Get token from storage

  if (!token) {
    console.error("No authentication token found. User may not be logged in.");
    return throwError(() => new Error("Authentication token missing."));
  }

  return this.apollo.watchQuery({
    query: GET_MY_REPORTS,
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: `Bearer ${token}` // Include token in header
      }
    }
  }).valueChanges.pipe(
    map(result => {
      console.log("Fetched Reports:", result.data);
      return result.data;
    })
  );
}

  getAllReportUssd(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_ALL_REPORT_USSD,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result.data.allReportsUssds)
    )
}

  ConfirmReportUssd(id: number): Observable<any> {
    return this.http.post(`${this.confirmReportUrl}${id}/`, {});
}

//   submitReportREST(formData: FormData): Observable<any> {
//   return this.http.post(`${this.resetUrl}/reports/`, formData);
// }

submitReportREST(formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');  // adjust key as needed

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(`${this.resetUrl}/reports/`, formData, { headers });
}




registerWardAndStreets(wardName: string, streets: string[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      wardName: wardName,
      streets: streets
    };
    return this.http.post(`${this.resetUrl}/streets/register/`, payload, { headers });
  }



getReportsByStreet(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.resetUrl}/reports/street/`, { headers });
}


registerWard(name: string) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.post(`${this.resetUrl}/wards/register/`, { name }, { headers });
}

getWards(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.resetUrl}/wards/register/`, { headers });
  }


  forwardReportToWard(reportId: number): Observable<any> {
    const token = localStorage.getItem('token'); // your JWT token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.resetUrl}/reports/${reportId}/forward/`, {}, { headers });
  }


}
