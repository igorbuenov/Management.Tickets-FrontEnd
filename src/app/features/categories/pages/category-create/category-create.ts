import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CategoryService } from '../../services/category'; 
import { CreateCategoryModel } from '../../models/create-category.model';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './category-create.html'
})
export class CategoryCreateComponent {

  isLoading = signal(false);
  message = signal('');
  isError = signal(false);

  categoryForm;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();

      this.message.set('Informe o nome da categoria.');
      this.isError.set(true);

      return;
    }

    const request: CreateCategoryModel = {
      name: this.categoryForm.value.name?.trim() ?? ''
    };

    if (!request.name) {
      this.message.set('Informe o nome da categoria.');
      this.isError.set(true);

      return;
    }

    this.isLoading.set(true);
    this.message.set('');
    this.isError.set(false);

    this.categoryService.createCategory(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoading.set(false);
          this.isError.set(false);
          this.message.set('Categoria criada com sucesso.');

          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 1000);

          return;
        }

        this.isLoading.set(false);
        this.message.set('Não foi possível criar a categoria.');
        this.isError.set(true);
      },

      error: (error) => {
        console.error('Erro ao criar categoria:', error);

        this.isLoading.set(false);
        this.message.set(
          'Ocorreu um erro ao criar a categoria. Tente novamente.'
        );
        this.isError.set(true);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
