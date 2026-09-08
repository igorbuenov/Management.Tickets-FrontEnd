import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TicketModel } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetailsComponent implements OnInit {

  ticket = signal<TicketModel | null>(null);
  isLoading = signal(false);
  hasError = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('ID do ticket inválido.');
      return;
    }

    this.loadTicket(id);
  }

  loadTicket(id: number): void {
    this.isLoading.set(true);

    this.ticketService.getTicketById(id).subscribe({
      next: (response) => {
        this.ticket.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar ticket:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}