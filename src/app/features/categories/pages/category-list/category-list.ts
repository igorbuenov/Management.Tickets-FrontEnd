import { Component, OnInit, computed, signal } from '@angular/core';
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

  // --- INÍCIO DA LÓGICA DE PAGINAÇÃO RICA ---
  readonly maxVisiblePages = 5;

  visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.page();
    const max = this.maxVisiblePages;

    if (total <= max + 2) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    const pages: (number | '...')[] = [];

    pages.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) {
      pages.push('...');
    }

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });
  // --- FIM DA LÓGICA DE PAGINAÇÃO RICA ---

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

  // --- MÉTODOS DE AÇÃO DA PAGINAÇÃO ATUALIZADOS ---
  goToPage(pageNumber: number): void {
    if (
      pageNumber < 1 ||
      pageNumber > this.totalPages()
    ) {
      return;
    }

    this.page.set(pageNumber);
    this.loadCategories();
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.goToPage(this.page() - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.goToPage(this.page() + 1);
    }
  }

  changePageSize(): void {
    this.page.set(1);
    this.loadCategories();
  }
}