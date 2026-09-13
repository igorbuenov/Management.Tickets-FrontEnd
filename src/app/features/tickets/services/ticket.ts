import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth';

import { API_ENDPOINTS} from '../../../core/constants/api.constants';
import { TicketListResponseModel } from '../models/ticket-list-response';
import { TicketModel } from '../models/ticket';
import { CreateTicket, CreateTicketResponseModel } from '../models/create-ticket.model';
import { Observable } from 'rxjs';
import { TicketMessage } from '../models/ticket-message.model';
import { CreateTicketMessageRequest } from '../models/create-ticket-message-request.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private readonly apiUrl = API_ENDPOINTS.tickets;

  constructor(
    private http: HttpClient,
    private readonly authService: AuthService
  ) {}

  
  getTickets(
    page: number = 1,
    pageSize: number = 10,
    title: string = '',
    priority?: number,
    status?: number
  ) {
    const token = this.authService.getToken();

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (title.trim()) {
      params = params.set('title', title.trim());
    }

    if (priority !== undefined) {
      params = params.set('priority', priority);
    }

    if (status !== undefined) {
      params = params.set('status', status);
    }

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

  getTicketsAssigned(
    page: number = 1,
    pageSize: number = 10,
    title: string = '',
    priority?: number,
    status?: number
  ) {
    const token = this.authService.getToken();

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (title.trim()) {
      params = params.set('title', title.trim());
    }

    if (priority !== undefined) {
      params = params.set('priority', priority);
    }

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<TicketListResponseModel>(
      `${this.apiUrl}/assigned`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
  }

  getTicketsByUserId(
    page: number = 1,
    pageSize: number = 10,
    title: string = '',
    priority?: number,
    status?: number
  ) {
    const token = this.authService.getToken();

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (title.trim()) {
      params = params.set('title', title.trim());
    }

    if (priority !== undefined) {
      params = params.set('priority', priority);
    }

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<TicketListResponseModel>(
      `${this.apiUrl}/created-by-userid`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
  }

  getTicketById(id: number){

    const token = this.authService.getToken();

    return this.http.get<TicketModel>(
      `${this.apiUrl}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  }

  createTicket(request: CreateTicket){
    const token = this.authService.getToken();

    return this.http.post<CreateTicketResponseModel>(
      `${this.apiUrl}`,
       request,
       {
        headers: {
          'Authorization': `Bearer ${token}`
        }
       }
    )

  }

  assignTicketTo(ticketId: number, technicianId: number): Observable<void>{
    const token = this.authService.getToken();

    return this.http.put<void>(
      `${this.apiUrl}/${ticketId}/assign`,
      {
        technicianId 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  getMessages(ticketId: number): Observable<TicketMessage[]> {
    const token = this.authService.getToken();

    return this.http.get<TicketMessage[]>(
      `${this.apiUrl}/${ticketId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  createMessage(
    ticketId: number,
    request: CreateTicketMessageRequest
  ): Observable<void> {
    const token = this.authService.getToken();

    return this.http.post<void>(
      `${this.apiUrl}/${ticketId}/messages`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }
}