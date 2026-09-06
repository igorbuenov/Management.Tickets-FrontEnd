import { Component, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {

  ticketsMenuOpen = signal(true);
  usersMenuOpen = signal(false);
  isAdmin = signal(false);

  constructor() {
    this.checkUserRole();
  }

  toggleTicketsMenu(): void {
    this.ticketsMenuOpen.update(value => !value);
  }

  toggleUsersMenu(): void {
    this.usersMenuOpen.update(value => !value);
  }

  private checkUserRole(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const role =
        payload.role ??
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      this.isAdmin.set(role === 'Admin');

    } catch (error) {
      console.error('Erro ao ler token:', error);
      this.isAdmin.set(false);
    }
  }
}