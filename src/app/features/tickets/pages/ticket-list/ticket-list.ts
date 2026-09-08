import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TicketModel } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketListComponent implements OnInit {

  tickets = signal<TicketModel[]>([]);
  isLoading = signal(false);

  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  search = signal('');
  priority = signal<number | undefined>(undefined);
  status = signal<number | undefined>(undefined);

  readonly maxVisiblePages = 5;

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages;

    if (total <= max + 2) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    const pages: (number | '...')[] = [];

    pages.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) {
      pages.push('...');
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });

  constructor(
    private readonly ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading.set(true);

    this.ticketService.getTickets(
      this.currentPage(),
      this.pageSize(),
      this.search(),
      this.priority(),
      this.status()
    ).subscribe({
      next: (response) => {
        this.tickets.set(response.items);
        this.currentPage.set(response.page);
        this.pageSize.set(response.pageSize);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);

        console.log(
          'Tickets carregados com sucesso:',
          response
        );
      },

      error: (error) => {
        console.error(
          'Erro ao carregar tickets:',
          error
        );

        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages()
    ) {
      return;
    }

    this.currentPage.set(page);
    this.loadTickets();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  onPriorityChange(value: string): void {
    if (value === '') {
      this.priority.set(undefined);
      return;
    }

    this.priority.set(Number(value));
  }

  onStatusChange(value: string): void {
    if (value === '') {
      this.status.set(undefined);
      return;
    }

    this.status.set(Number(value));
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadTickets();
  }

  clearFilters(): void {
    this.search.set('');
    this.priority.set(undefined);
    this.status.set(undefined);
    this.currentPage.set(1);

    this.loadTickets();
  }
}