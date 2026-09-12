import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth';

import {
  CreateDepartmentModel,
  CreateDepartmentResponseModel,
  DepartmentModel
} from '../models/create-department.model';

import { DepartmentListResponseModel } from '../models/department-list-response.model';

import {API_ENDPOINTS} from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  private readonly apiUrl = API_ENDPOINTS.departments;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createDepartment(request: CreateDepartmentModel) {

    const token = this.authService.getToken();

    return this.http.post<CreateDepartmentResponseModel>(
      this.apiUrl,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  getDepartments(
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

    return this.http.get<DepartmentListResponseModel>(
      this.apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
  }

  getMyDepartments() {
  const token = this.authService.getToken();

  return this.http.get<DepartmentModel[]>(
    `${this.apiUrl}/my-departments`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
}
}