import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiErrorResponse } from '../../../models/api-error-response';
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

  currentYear = new Date().getFullYear();

  email = '';
  password = '';
  message = signal('');
  isError = signal(false);
  isLoading = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    if (this.isLoading()) {
      return;
    }

    this.message.set('');
    this.isError.set(false);
    this.isLoading.set(true);

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {

        localStorage.setItem(
          'accessToken',
          response.accessToken
        );

        localStorage.setItem(
          'currentUser',
          JSON.stringify(response.user)
        );

        this.isLoading.set(false);

        if (response.mustChangePassword === true) {
           this.router.navigate(['/change-password']); 
           return; 
        }

        this.router.navigate(['/dashboard']);
      },

      error: error => {
        console.error(
          'Erro ao realizar login:',
          error
        );

        this.isLoading.set(false);
        this.isError.set(true);

        const apiError = error.error as ApiErrorResponse;

        if(apiError?.errors?.length) {
          this.message.set(apiError.errors[0]);
          return;
        }

        this.message.set(
          'Ocorreu um erro ao realizar login. Tente novamente mais tarde.'
        );
        
      }
    });
  }
}