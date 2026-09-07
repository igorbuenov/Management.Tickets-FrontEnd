import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {

  email = '';

  isLoading = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.email.trim()) {
      this.errorMessage.set('Informe seu email.');
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.submitted.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          'Ocorreu um erro ao enviar o email de recuperação. Tente novamente.'
        );

        console.error('Erro ao enviar email de recuperação:', error);
        this.isLoading.set(false);
      }
    });
  }
}