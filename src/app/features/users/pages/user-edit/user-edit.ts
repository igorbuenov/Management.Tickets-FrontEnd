import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class UserEditComponent implements OnInit {

  private userId: number | null = null;
  name = '';
  email = '';

  isLoading = signal(false);
  isError = signal(false);
  message = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); 

    if (!id) {
      this.isError.set(true);
      this.message.set('Usuário não encontrado.');
      return;
    }

    this.userId = id;

    this.loadUser();
  }

  private loadUser(): void{

    if (this.userId === null) {
      return;
    }

    this.isLoading.set(true);
    this.message.set('');
    this.isError.set(false);

  
    this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.name = user.name,
          this.email = user.email;

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);

          this.isLoading.set(false);
          this.isError.set(true);
          this.message.set(
            error.error?.message ??
            'Não foi possível carregar os dados do usuário.'
          );
        }
      }
    );
  }

  updateUser(): void {
    if (this.isLoading() || this.userId === null) {
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

    const request = {
      name: this.name.trim(),
      email: this.email.trim()
    };

    this.isLoading.set(true);

    this.userService.updateUser(this.userId, request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isError.set(false);
        this.message.set('Usuário atualizado com sucesso!');

        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.isLoading.set(false);
        this.isError.set(true);

        if(error.status === 400) {
          this.message.set(
            error.error?.message ??
            'Dados inválidos. Verifique as informações fornecidas.'
          );
        } else {
          this.message.set(
            error.error?.message ??
            'Não foi possível atualizar o usuário. Tente novamente mais tarde.'
          );
        }
      }
    });
  }
}
