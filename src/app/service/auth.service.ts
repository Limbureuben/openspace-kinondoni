import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, tap } from 'rxjs';
import { GET_USER_PROFILE, LOGIN_USER, LOGIN_USER_AGAIN, LOGIN_USER_MUTATION, REGISTER_MUTATION, REGISTER_USER } from '../graphql';
import { LoginData, RegisterData } from '../models/openspace.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { match } from 'assert';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

  export type { RegisterData, LoginData };

  export interface Ward {
    id: number;
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private resetUrl = 'http://localhost:8000';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
    const sessionId = typeof localStorage !== 'undefined' ? localStorage.getItem('sessionId') : null;

    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        username: userData.username,
        sessionId: sessionId ? sessionId : null,
        ...(userData.role ? { role: userData.role } : {}),
        email: userData.email || null,
        ...(userData.ward ? { ward: userData.ward } : {}),
        ...(userData.street ? { street: userData.street } : {}),
      }
    });



        // return this.apollo.mutate({
        //   mutation: REGISTER_USER,
        //   variables: {
        //     password: userData.password,
        //     passwordConfirm: userData.passwordConfirm,
        //     username: userData.username,
        //     sessionId: sessionId ? sessionId : null,
        //     ...(userData.role ? { role: userData.role } : {}),
        //     email: userData.email || null,
        //     ...(userData.ward ? { ward: String(userData.ward.id) } : {}),
        //     ...(userData.street ? { street: String(userData.street.id) } : {}),
        //   }
        // });
  }

  signinUser(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_USER_AGAIN,
      variables: {
        username,
        password
      }
    });
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.put<any>('http://localhost:8000/api/v1/upload-profile-image/', formData);
  }



  Logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('lastRoute');
    }

    this.toast.success('Logout successful!', 'Success', {
      positionClass: 'toast-top-right',
      timeOut: 1500,
      progressBar: true
    });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }

  isLoggedIn(): boolean {
    const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('success_token') : null;
    console.log('Access Token:', accessToken);
    return !!accessToken;
  }

  generateSessionId(): string {
    if (typeof localStorage !== 'undefined') {
      let sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = 'anon_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    }
    // Return a temporary session ID for SSR
    return 'anon_' + Math.random().toString(36).substring(2, 11);
  }

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/profile/');
  }

  sendResetLink(email: string): Observable<any> {
    return this.http.post(`${ this.resetUrl}/api/v1/password-reset/`, { email });
  }

  confirmResetPassword(uid: string, token: string, password: string): Observable<any> {
    const payload = {
      uid: uid,
      token: token,
      password: password
    };
    return this.http.post(`${this.resetUrl}/api/v1/password-reset-confirm/`, payload)
  }

  getWards(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.resetUrl}/api/v1/wards/`);
  }


  getStreetsForWard(): Observable<string[]> {
    return this.http.get<string[]>(`${this.resetUrl}/api/v1/streets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getAdminWards(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.resetUrl}/api/v1/wards-admin/`);
  }

  getStreetsByWard(wardName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.resetUrl}/api/v1/streets-admin/?ward=${wardName}`);
  }

}






