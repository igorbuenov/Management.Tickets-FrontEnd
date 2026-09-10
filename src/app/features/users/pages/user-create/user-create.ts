import { Component,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreateComponent {

  name = '';
  email = ''
  roleId: number | null = null;

  isLoading = signal(false);
  isError = signal(false);
  message = signal('');

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  createUser(): void {

    if(this.isLoading()){
      return;
    }

    this.message.set(''); 
    this.isError.set(false);
    
    if (!this.name.trim()) {
      this.isError.set(true);
      this.message.set('Informe o nome.');
      return;
    }

    if (!this.email.trim()) {
      this.isError.set(true);
      this.message.set('Informe o email.');
      return;
    }

    if (this.roleId === null) {
      this.isError.set(true);
      this.message.set('Selecione o perfil.');
      return;
    }

    const request = { name: this.name, email: this.email, roleID: this.roleId };

    this.isLoading.set(true);

    this.userService.createUser(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.isError.set(false);
        this.message.set('Usuário criado com sucesso!');

        setTimeout(() => {
           this.router.navigate(['/users']);
        }, 1000);
      },
      error: (error) => {
        console.error('API error:', error);
        this.isLoading.set(false);
        this.isError.set(true);

        if(error.status === 400) {
          this.message.set(
            error.error?.message ?? 
            'Dados inválidos. Por favor, verifique as informações fornecidas.'  
          );
        } else {
          this.message.set(
            error.error?.message ?? 
            'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.'
          );
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

}
