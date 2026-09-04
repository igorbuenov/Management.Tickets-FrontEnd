import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {

  email = '';
  password = '';

  message = signal('');
  isError = signal(false);

  constructor(private authService: AuthService) {}

  login(): void {

    this.message.set(''); 
    this.isError.set(false);

    const request = { email: this.email, password: this.password };

    this.authService.login(request).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        this.message.set('Login realizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro da API:', error);
        this.isError.set(true);

        if(error.status === 401) {
          this.message.set('Credenciais inválidas. Por favor, verifique seu e-mail e senha.');
        } else {
          this.message.set('Ocorreu um erro ao realizar o login. Por favor, tente novamente mais tarde.');
        }
      }
    });
  }
}
