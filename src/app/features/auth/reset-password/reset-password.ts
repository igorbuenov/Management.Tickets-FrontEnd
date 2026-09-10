import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent implements OnInit {

  private token: string | null = null;

  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  isTokenValid = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.errorMessage.set(
        'Link de recuperação inválido.'
      );

      return;
    }

    this.isTokenValid.set(true);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.token) {
      this.errorMessage.set(
        'Link de recuperação inválido.'
      );

      return;
    }

    if (!this.password || !this.confirmPassword) {
      this.errorMessage.set(
        'Preencha os dois campos.'
      );

      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set(
        'As senhas não coincidem.'
      );

      return;
    }

    this.isLoading.set(true);

    this.authService
      .resetPassword(
        this.token,
        this.password
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);

          this.successMessage.set(
            'Senha redefinida com sucesso. Você será redirecionado para o login.'
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },

        error: (error) => {
          console.error(
            'Erro ao redefinir senha:',
            error
            
          );

          this.isLoading.set(false);

          // Verifica se a API retornou o array de erros esperado
          if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
            // Junta todas as mensagens do array em uma única string separada por espaço
            const mensagensFormatadas = error.error.errors.join(' ');
            
            // Define a mensagem exata da API no atributo
            this.errorMessage.set(mensagensFormatadas);
          } else {
            // Fallback: Mensagem padrão caso seja um erro genérico (ex: servidor caiu, erro 500, etc)
            this.errorMessage.set(
              'Não foi possível redefinir sua senha. O link pode ser inválido, expirado ou já utilizado.'
            );
          }
        }
      });
  }
}