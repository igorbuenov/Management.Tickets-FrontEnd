import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePasswordComponent {

  isLoading = signal(false);
  isError = signal(false);
  message = signal('');

  passwordForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.isLoading()) {
      return;
    }

    this.message.set('');
    this.isError.set(false);

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.isError.set(true);
      this.message.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const newPassword = this.passwordForm.value.newPassword ?? '';
    const confirmPassword = this.passwordForm.value.confirmPassword ?? '';

    if (newPassword !== confirmPassword) {
      this.isError.set(true);
      this.message.set('As senhas não coincidem.');
      return;
    }

    const token = this.authService.getToken();

    if (!token) {
      this.isError.set(true);
      this.message.set('Sua sessão expirou. Faça login novamente.');
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.isError.set(true);
      this.message.set('Não foi possível identificar o usuário.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .changeTemporaryPassword(
        userId,
        newPassword,
        confirmPassword
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isError.set(false);
          this.message.set('Senha alterada com sucesso!');

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },

        error: (error) => {
          console.error('Erro ao alterar senha:', error);

          this.isLoading.set(false);
          this.isError.set(true);

          this.message.set(
            error.error?.errors?.[0] ??
            'Não foi possível alterar a senha. Tente novamente.'
          );
        }
      });
  }
}
