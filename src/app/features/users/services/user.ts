import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  CreateUserModel,
  CreateUserResponseModel
} from '../models/create-user.model';

import { UserListResponseModel } from '../models/user-list-response.model';

import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl = API_ENDPOINTS.users;

  constructor(private http: HttpClient) {}

  createUser(request: CreateUserModel) {
    const token = localStorage.getItem('accessToken');

    return this.http.post<CreateUserResponseModel>(
      this.apiUrl,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  GetUsers(page: number = 1, pageSize: number = 10) {

    const token = localStorage.getItem('accessToken');

    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<UserListResponseModel>(
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