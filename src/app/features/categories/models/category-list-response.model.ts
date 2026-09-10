
import { CategoryModel } from './create-category.model';

export interface CategoryListResponseModel {
  items: CategoryModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

