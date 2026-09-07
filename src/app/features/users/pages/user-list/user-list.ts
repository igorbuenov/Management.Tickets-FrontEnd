import { Component, OnInit, signal } from '@angular/core';
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {

    this.isLoading.set(true);

    this.userService.getUsers(
      this.currentPage(),
      this.pageSize()
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

  deleteUser(id: number): void {
    const confirmed = window.confirm(
      'Tem certeza que deseja desativar este usuário?'
    );

    if (!confirmed) {
      return;
    }

    this.isLoading.set(true);

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.isLoading.set(false);

        this.loadUsers();
      },

      error: (error) => {
        console.error('Erro ao desativar usuário:', error);

        this.isLoading.set(false);
      }
    });
  }

}