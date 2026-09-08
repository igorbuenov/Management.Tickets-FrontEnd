import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserListComponent implements OnInit {

  users = signal<UserModel[]>([]);
  isLoading = signal(false);

  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  search = signal('');
  isActive = signal<boolean | undefined>(undefined);

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

  showDeactivateModal = signal(false);
  showReactivateModal = signal(false);
  selectedUserId = signal<number | null>(null);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading.set(true);

    this.userService.getUsers(
      this.currentPage(),
      this.pageSize(),
      this.search(),
      this.isActive()
    ).subscribe({
      next: (response) => {
        this.users.set(response.items);
        this.currentPage.set(response.page);
        this.pageSize.set(response.pageSize);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);

        console.log(
          'Usuários carregados com sucesso:',
          response
        );
      },
      error: (error) => {
        console.error(
          'Erro ao carregar usuários:',
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
    this.loadUsers();
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

  onStatusChange(value: string): void {
    if (value === '') {
      this.isActive.set(undefined);
      return;
    }

    this.isActive.set(value === 'true');
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  clearFilters(): void {
    this.search.set('');
    this.isActive.set(undefined);
    this.currentPage.set(1);

    this.loadUsers();
  }

  deleteUser(id: number): void {
    this.selectedUserId.set(id);
    this.showDeactivateModal.set(true);
  }

  reactivateUser(id: number): void {
    this.selectedUserId.set(id);
    this.showReactivateModal.set(true);
  }


  confirmDeactivate(): void {
    const id = this.selectedUserId();

    if (id === null) {
      return;
    }

    this.showDeactivateModal.set(false);
    this.isLoading.set(true);

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.loadUsers();
      },
      error: (error) => {
        console.error(
          'Erro ao desativar usuário:',
          error
        );

        this.isLoading.set(false);
      }
    });
  }

  cancelDeactivate(): void {
    this.showDeactivateModal.set(false);
    this.selectedUserId.set(null);
  }

  confirmReactivate(): void {
    const id = this.selectedUserId();

    if (id === null) {
      return;
    }

    this.showReactivateModal.set(false);
    this.isLoading.set(true);

    this.userService.activateUser(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.selectedUserId.set(null);
        this.loadUsers();
      },
      error: (error) => {
        console.error(
          'Erro ao reativar usuário:',
          error
        );

        this.isLoading.set(false);
        this.selectedUserId.set(null);
      }
    });
  }

  cancelReactivate(): void {
    this.showReactivateModal.set(false);
    this.selectedUserId.set(null);
  }




}