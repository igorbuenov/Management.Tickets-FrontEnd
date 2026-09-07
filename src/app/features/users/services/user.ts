import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth';

import {
  CreateUserModel,
  CreateUserResponseModel,
  UserModel
} from '../models/create-user.model';
import { UserListResponseModel } from '../models/user-list-response.model';
import { UpdateUserModel } from '../models/update-user.model';
import { UserDetailsModel } from '../models/user-details.model';

import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl = API_ENDPOINTS.users;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createUser(request: CreateUserModel) {
    const token = this.authService.getToken();

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

  getUsers(page: number = 1, pageSize: number = 10) {

    const token = this.authService.getToken();

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

  getUserById(id: number){

    const token = this.authService.getToken();
    return this.http.get<UserDetailsModel>(
      `${this.apiUrl}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  updateUser(id:number, request: UpdateUserModel){
    const token = this.authService.getToken();

    return this.http.put<void>(
      `${this.apiUrl}/${id}/update-user`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

  deleteUser(id: number){
    const token = this.authService.getToken();

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }

}