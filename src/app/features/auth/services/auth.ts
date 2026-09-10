import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, API_LOCAL_ENDPOINTS,  } from '../../../core/constants/api.constants';
import { LoginResponseModel } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'accessToken';
  private readonly userKey = 'currentUser';
  private readonly apiUrl = API_LOCAL_ENDPOINTS.auth;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponseModel> {

    return this.http.post<LoginResponseModel>( 
      `${this.apiUrl}/login`, 
      credentials 
    );
  }

  forgotPassword(email: string): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/forgot-password`,
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
      `${this.apiUrl}/reset-password`,
      {
        token,
        newPassword
      }
    );
  }

  changeTemporaryPassword(
    userId: number,
    newPassword: string,
    confirmPassword: string
  ): Observable<void> {
    const token = this.getToken();

    return this.http.put<void>(
      `${this.apiUrl}/${userId}/change-temporary-password`,
      {
        newPassword,
        confirmPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  getUserId(): number | null { 
    const token = this.getToken(); 
    if (!token) {
       return null; 
      } 
      try {
         const payload = JSON.parse( atob(token.split('.')[1])); 
         const userId = 
            payload.sub ?? 
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

         return userId ? Number(userId) : null; 

      } catch (error) { 
        console.error('Erro ao ler ID do usuário:', error); 
        return null; 
      } 
  }

  getCurrentUser(): LoginResponseModel['user'] | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}