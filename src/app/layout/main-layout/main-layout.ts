import { Component, OnInit, signal, computed } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {AuthService} from '../../features/auth/services/auth';
import { NotificationService } from '../../features/notifications/services/notification';
import { NotificationModel } from '../../features/notifications/models/notification.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    JsonPipe
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnInit {

  currentYear = new Date().getFullYear();

  ticketsMenuOpen = signal(true);
  usersMenuOpen = signal(false);
  sectorsMenuOpen = signal(false);
  categoriesMenuOpen = signal(false);
  isAdmin = signal(false);
  isTechnician = signal(false);
  notifications = signal<NotificationModel[]>([]);
  notificationsLoading = signal(false);
  notificationsError = signal(false);
  notificationsOpen = signal(false);

  mobileMenuOpen = signal(false);

  constructor(
    private authService: AuthService,
    private readonly notificationService: NotificationService
  ) {
    const role = this.authService.getUserRole();

    this.isAdmin.set(role === 'Admin');
    this.isTechnician.set(role === 'Technician');
  }

  ngOnInit(): void {
    this.loadNotifications();
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

  loadNotifications(): void {
    this.notificationsLoading.set(true);
    this.notificationsError.set(false);

    this.notificationService.getNotifications().subscribe({
      next: notifications => {
        this.notifications.set(notifications);
        this.notificationsLoading.set(false);
      },
      error: () => {
        this.notificationsError.set(true);
        this.notificationsLoading.set(false);
      }
    });
  }

  unreadNotifications = computed(() =>
    this.notifications().filter(
      notification => !notification.isRead
    ).length
  );

  markNotificationAsRead(
    notification: NotificationModel
  ): void {

    if (notification.isRead) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({
        next: () => {
          this.notifications.update(notifications =>
            notifications.filter(
              item => item.id !== notification.id
            )
          );
        }
      });
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(value => !value);
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }


}