import { Component, OnInit } from '@angular/core';
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

  users: UserModel[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.GetUsers().subscribe({
      next: (response) => {
        this.users = response.items;

        console.log('Usuários carregados com sucesso:', this.users);
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }
}