
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth'; 

import {
  CreateCategoryModel,
  CreateCategoryResponseModel
} from '../models/create-category.model';

import { CategoryListResponseModel } from '../models/category-list-response.model';

import { API_LOCAL_ENDPOINTS, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private readonly apiUrl = API_ENDPOINTS.categories;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createCategory(request: CreateCategoryModel) {
    const token = this.authService.getToken();

    return this.http.post<CreateCategoryResponseModel>(
      this.apiUrl,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  getCategories(
    page: number = 1,
    pageSize: number = 10,
    name?: string
  ) {
    const token = this.authService.getToken();

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (name?.trim()) {
      params = params.set('name', name.trim());
    }

    return this.http.get<CategoryListResponseModel>(
      this.apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
  }
}
