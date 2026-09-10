import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TicketService } from '../../services/ticket';
import { CreateTicket } from '../../models/create-ticket.model';
import { DepartmentModel } from '../../../departments/models/create-department.model';
import { DepartmentService } from '../../../departments/services/department';
import { CategoryModel } from '../../../categories/models/create-category.model';
import { CategoryService } from '../../../categories/services/category';

@Component({
  selector: 'app-ticket-create',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css',
})
export class TicketCreateComponent {

  isLoading = signal(false);
  isError = signal(false);
  message = signal('');
  departments = signal<DepartmentModel[]>([]);
  categories = signal<CategoryModel[]>([]);

  ticketForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ticketService: TicketService,
    private readonly router: Router,
    private readonly departmentService: DepartmentService ,
    private readonly categoryService: CategoryService
  ) {
    this.ticketForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: [2, [Validators.required]],
      departmentId: [null, Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCategories();
  }

  submit(): void {

    if (this.isLoading()) {
      return;
    }

    this.message.set('');
    this.isError.set(false);

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      this.isError.set(true);
      this.message.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const request: CreateTicket = {
      title: this.ticketForm.value.title ?? '',
      description: this.ticketForm.value.description ?? '',
      priority: this.ticketForm.value.priority ?? 2,
      departmentId: this.ticketForm.value.departmentId!,
      categoryId: this.ticketForm.value.categoryId!
    };

    this.isLoading.set(true);

    this.ticketService.createTicket(request).subscribe({
      next: (response) => {

        this.isLoading.set(false);
        this.isError.set(false);
        this.message.set('Ticket criado com sucesso!');

        console.log('Ticket criado com sucesso:', response);

        setTimeout(() => {
          this.router.navigate(['/tickets']);
        }, 1500);
      },

      error: (error) => {

        console.error('Erro ao criar ticket:', error);

        this.isLoading.set(false);
        this.isError.set(true);

        if (error.status === 400) {
          this.message.set(
            error.error?.message ??
            'Dados inválidos. Por favor, verifique as informações fornecidas.'
          );
        } else {
          this.message.set(
            error.error?.message ??
            'Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.'
          );
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tickets']);
  }

  loadDepartments(): void {
    this.departmentService.getMyDepartments().subscribe({
      next: (response) => {
        this.departments.set(response);
      },
      error: (error) => {
        console.error('Erro ao carregar departamentos:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories(1, 50).subscribe({
      next: (response) => {
        this.categories.set(response.items);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

}
