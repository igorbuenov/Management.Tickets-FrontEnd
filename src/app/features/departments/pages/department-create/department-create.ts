
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DepartmentService } from '../../services/department'; 
import { CreateDepartmentModel } from '../../models/create-department.model'; 

@Component({
  selector: 'app-department-create',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './department-create.html'
})
export class DepartmentCreateComponent {

  isLoading = signal(false);
  message = signal('');
  isError = signal(false);

  departmentForm;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();

      this.message.set('Informe o nome do departamento.');
      this.isError.set(true);

      return;
    }

    const request: CreateDepartmentModel = {
      name: this.departmentForm.value.name?.trim() ?? ''
    };

    if (!request.name) {
      this.message.set('Informe o nome do departamento.');
      this.isError.set(true);

      return;
    }

    this.isLoading.set(true);
    this.message.set('');
    this.isError.set(false);

    this.departmentService.createDepartment(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoading.set(false);
          this.isError.set(false);
          this.message.set('Departamento criado com sucesso.');

          setTimeout(() => {
            this.router.navigate(['/departments']);
          }, 1000);

          return;
        }

        this.isLoading.set(false);
        this.message.set('Não foi possível criar o departamento.');
        this.isError.set(true);
      },

      error: (error) => {
        console.error('Erro ao criar departamento:', error);

        this.isLoading.set(false);
        this.message.set(
          'Ocorreu um erro ao criar o departamento. Tente novamente.'
        );
        this.isError.set(true);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}
