import { Component, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {AuthService} from '../../features/auth/services/auth';

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

  constructor(private authService: AuthService) {
    this.isAdmin.set(this.authService.getUserRole() === 'Admin');
  }

  toggleTicketsMenu(): void {
    this.ticketsMenuOpen.update(value => !value);
  }

  toggleUsersMenu(): void {
    this.usersMenuOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }

}