import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NotificationModel } from '../models/notification.model';
import { AuthService } from '../../auth/services/auth';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl = API_ENDPOINTS.notifications;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getNotifications(): Observable<NotificationModel[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<NotificationModel[]>(
      this.apiUrl,
      { headers }
    );
  }

  markAsRead(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<void>(
      `${this.apiUrl}/${id}/read`,
      {},
      { headers }
    );
  }


}

