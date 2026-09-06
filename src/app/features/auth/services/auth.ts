import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {API_ENDPOINTS } from '../../../core/constants/api.constants'
import { Router } from '@angular/router';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly apiUrl = API_ENDPOINTS.auth;
  private readonly accessToken = 'accessToken';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getToken(): string | null {
    return localStorage.getItem(this.accessToken);
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (
        payload.role ??
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
        null
      );
    } catch (error) {
      console.error('Erro ao ler token:', error);
      return null;
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`, 
      request);
  }

  logout() : void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }

}
