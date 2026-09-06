import { UserModel } from './user.model';

export interface UserListResponseModel {
  items: UserModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}