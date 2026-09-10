import { DepartmentModel } from './create-department.model';

export interface DepartmentListResponseModel {
  items: DepartmentModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}