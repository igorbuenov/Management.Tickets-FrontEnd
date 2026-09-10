
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { CategoryService } from '../../services/category'; 
import { CategoryModel } from '../../models/create-category.model'; 

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {

  categories = signal<CategoryModel[]>([]);
  page = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);
  search = signal('');
  isLoading = signal(false);

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);

    this.categoryService
      .getCategories(
        this.page(),
        this.pageSize(),
        this.search()
      )
      .subscribe({
        next: (response) => {
          this.categories.set(response.items);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(response.totalPages);
          this.isLoading.set(false);
        },

        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          this.isLoading.set(false);
        }
      });
  }

  searchCategories(): void {
    this.page.set(1);
    this.loadCategories();
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
    this.loadCategories();
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update(value => value - 1);
      this.loadCategories();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(value => value + 1);
      this.loadCategories();
    }
  }

  changePageSize(): void {
    this.page.set(1);
    this.loadCategories();
  }
}
