import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  message = signal('');
  isError = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {

    this.message.set('');
    this.isError.set(false);

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {
        localStorage.setItem(
          'accessToken',
          response.accessToken
        );

        this.router.navigate(['/dashboard']);
      },

      error: error => {

        console.error(
          'Erro ao realizar login:',
          error
        );

        this.message.set(
          'Email ou senha inválidos.'
        );

        this.isError.set(true);
      }

    });
  }
}