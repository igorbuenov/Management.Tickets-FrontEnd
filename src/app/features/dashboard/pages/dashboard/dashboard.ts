import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { UserService } from '../../../users/services/user';
import { TicketService } from '../../../tickets/services/ticket';
import { TicketModel } from '../../../tickets/models/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  totalUsers = signal(0);
  totalTickets = signal(0);
  recentTickets = signal<TicketModel[]>([]);

  constructor(
    private readonly userService: UserService,
    private readonly ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {

    this.userService.getUsers(1, 1).subscribe({
      next: response => {
        this.totalUsers.set(response.totalCount);
      },
      error: error => {
        console.error(
          'Erro ao carregar quantidade de usuários:',
          error
        );
      }
    });

    this.ticketService.GetTickets(1, 1).subscribe({
      next: response => {
        this.totalTickets.set(response.totalCount);
      },
      error: error => {
        console.error(
          'Erro ao carregar quantidade de tickets:',
          error
        );
      }
    });

    this.ticketService.GetTickets(1, 5).subscribe({
      next: response => {
        this.recentTickets.set(response.items);
      },
      error: error => {
        console.error(
          'Erro ao carregar tickets recentes:',
          error
        );
      }
    });
  }
}
