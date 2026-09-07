import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'accessToken';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string }> {

    return this.http.post<{ accessToken: string }>(
      `${API_ENDPOINTS.auth}/login`,
      credentials
    );
  }

  forgotPassword(email: string): Observable<string> {
  return this.http.post(
    `${API_ENDPOINTS.auth}/forgot-password`,
    { email },
    {
      responseType: 'text'
    }
  );
}

  resetPassword(
    token: string,
    newPassword: string
  ): Observable<void> {

    return this.http.post<void>(
      `${API_ENDPOINTS.auth}/reset-password`,
      {
        token,
        newPassword
      }
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getUserRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return (
        payload.role ??
        payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ??
        null
      );

    } catch (error) {
      console.error(
        'Erro ao ler token:',
        error
      );

      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);

    this.router.navigate(['/login']);
  }
}