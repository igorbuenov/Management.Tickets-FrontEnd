import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { TicketModel } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../../auth/services/auth';
import { TicketMessage } from '../../models/ticket-message.model';

@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetailsComponent implements OnInit {

  ticket = signal<TicketModel | null>(null);
  messages = signal<TicketMessage[]>([]);
  isLoading = signal(false);
  messagesLoading = signal(false);
  hasError = signal(false);
  messagesError = signal(false);
  assignLoading = signal(false);
  assignSuccess = signal(false);
  assignMessage = signal('');
  assignIsError = signal(false);
  showAssignModal = signal(false);
  messageText = signal('');
  messageSending = signal(false);
  messageError = signal('');
  currentUserId = signal<number | null>(null);
  private ticketId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('ID do ticket inválido.');
      return;
    }

    this.ticketId = id;

    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.currentUserId.set(userId);
    }

    this.loadTicket(id);
    this.loadMessages(id);
  }

  isCurrentUserMessage(userId: number): boolean {
    return this.currentUserId() === userId;
  }

  goBack(): void {
    this.location.back();
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

  loadMessages(ticketId: number): void {
    this.messagesLoading.set(true);
    this.messagesError.set(false);

    this.ticketService.getMessages(ticketId).subscribe({
      next: (response) => {
        this.messages.set(response);
        this.messagesLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar mensagens:', error);
        this.messagesError.set(true);
        this.messagesLoading.set(false);
      }
    });
  }

  sendMessage(): void {
    const ticketId = this.ticketId;

    if (ticketId === null) {
      return;
    }

    const message = this.messageText().trim();

    if (!message) {
      return;
    }

    this.messageSending.set(true);
    this.messageError.set('');

    this.ticketService.createMessage(ticketId, {
      message
    }).subscribe({
      next: () => {
        this.messageText.set('');
        this.messageSending.set(false);

        this.loadMessages(ticketId);
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);

        this.messageSending.set(false);
        this.messageError.set(
          error.error?.errors ??
          'Não foi possível enviar a mensagem. Tente novamente.'
        );
      }
    });
  }


  openAssignModal(): void {
    this.assignMessage.set('');
    this.assignIsError.set(false);
    this.assignLoading.set(false);
    this.assignSuccess.set(false);

    this.showAssignModal.set(true);
  }

  cancelAssign(): void {
    this.showAssignModal.set(false);
    this.assignLoading.set(false);
    this.assignMessage.set('');
    this.assignIsError.set(false);
    this.assignSuccess.set(false);
  }

  confirmAssign(): void {
    const ticketId = this.ticketId;

    if (ticketId === null) {
      return;
    }

    const technicianId = this.authService.getUserId();

    if (technicianId === null) {
      console.error('Não foi possível identificar o usuário autenticado.');
      return;
    }

    this.assignLoading.set(true);
    this.assignMessage.set('');
    this.assignIsError.set(false);
    this.assignSuccess.set(false);

    this.ticketService.assignTicketTo(
      ticketId,
      technicianId
    ).subscribe({
      next: () => {
        this.assignLoading.set(false);
        this.assignIsError.set(false);
        this.assignMessage.set('Ticket assumido com sucesso!');
        this.assignSuccess.set(true);

        this.loadTicket(ticketId);
      },

      error: (error) => {
        console.error('Erro ao assumir ticket:', error);

        this.assignLoading.set(false);
        this.assignIsError.set(true);
        this.assignMessage.set(
          error.error?.errors ??
          'Não foi possível assumir o ticket. Tente novamente.'
        );
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

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'High':
        return 'Alta';

      case 'Medium':
        return 'Média';

      case 'Low':
        return 'Baixa';

      case 'Urgent':
        return 'Urgente';

      default:
        return 'Prioridade inválida';
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

  getStatusText(status: string): string {
    switch (status) {
      case 'Open':
        return 'Aberto';

      case 'InProgress':
        return 'Em andamento';

      case 'Resolved':
        return 'Resolvido';

      case 'Closed':
        return 'Fechado';

      default:
        return 'Status inválido';
    }
  }
}