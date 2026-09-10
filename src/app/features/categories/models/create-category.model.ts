
export interface CreateCategoryModel {
  name: string;
}

export interface CategoryModel {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  name: string;
}

export interface CreateCategoryResponseModel {
  success: boolean;
  category: CategoryModel;
}
