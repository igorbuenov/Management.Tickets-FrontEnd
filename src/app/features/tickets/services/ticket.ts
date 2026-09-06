import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { TicketListResponseModel } from '../models/ticket-list-response';

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private readonly apiUrl = API_ENDPOINTS.tickets;

  constructor(private http: HttpClient) {}

  GetTickets(page: number = 1, pageSize: number = 10) {

    const token = localStorage.getItem('accessToken');

    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<TicketListResponseModel>(
      this.apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
  }
}