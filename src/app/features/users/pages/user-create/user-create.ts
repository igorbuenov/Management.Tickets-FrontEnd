import { Component,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-create',
  imports: [FormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreateComponent {

  name = '';
  email = ''
  roleId = '';

  message = signal('');
  isError = signal(false);

  constructor(private userService: UserService) {}

  createUser(): void {

    this.message.set(''); 
    this.isError.set(false);

    const request = { name: this.name, email: this.email, roleID: Number(this.roleId) };

    this.userService.createUser(request).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);

        this.message.set('Usuário criado com sucesso!');
      },
      error: (error) => {
        console.error('API error:', error);
        this.isError.set(true);

        if(error.status === 400) {
          this.message.set(error.error.message || 'Dados inválidos. Por favor, verifique as informações fornecidas.'  );
        } else {
          this.message.set(error.error.message ||'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.');
        }
      }
    });
  }


}
