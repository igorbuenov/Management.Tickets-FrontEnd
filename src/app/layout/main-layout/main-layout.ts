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

  currentYear = new Date().getFullYear();

  ticketsMenuOpen = signal(true);
  usersMenuOpen = signal(false);
  sectorsMenuOpen = signal(false);
  categoriesMenuOpen = signal(false);
  isAdmin = signal(false);

  mobileMenuOpen = signal(false);

  constructor(private authService: AuthService) {
    this.isAdmin.set(this.authService.getUserRole() === 'Admin');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleTicketsMenu(): void {
    this.ticketsMenuOpen.update(value => !value);
  }

  toggleUsersMenu(): void {
    this.usersMenuOpen.update(value => !value);
  }
  
  toggleSectorsMenu(): void {
    this.sectorsMenuOpen.update(value => !value);
  }

  toggleCategoriesMenu(): void {
    this.categoriesMenuOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }

}