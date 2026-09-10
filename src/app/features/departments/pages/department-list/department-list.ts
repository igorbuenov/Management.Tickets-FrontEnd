import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DepartmentService } from '../../services/department'; 
import { DepartmentModel } from '../../models/create-department.model';


@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './department-list.html'
})
export class DepartmentListComponent implements OnInit {

  departments = signal<DepartmentModel[]>([]);
  page = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);
  search = signal('');
  isLoading = signal(false);

  constructor(
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);

    this.departmentService
      .getDepartments(
        this.page(),
        this.pageSize(),
        this.search()
      )
      .subscribe({
        next: (response) => {
          this.departments.set(response.items);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(response.totalPages);
          this.isLoading.set(false);
        },

        error: (error) => {
          console.error('Erro ao carregar departamentos:', error);
          this.isLoading.set(false);
        }
      });
  }

  searchDepartments(): void {
    this.page.set(1);
    this.loadDepartments();
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
    this.loadDepartments();
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update(value => value - 1);
      this.loadDepartments();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(value => value + 1);
      this.loadDepartments();
    }
  }

  changePageSize(): void {
    this.page.set(1);
    this.loadDepartments();
  }
}