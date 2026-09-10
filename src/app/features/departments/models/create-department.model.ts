export interface CreateDepartmentModel {
  name: string;
}

export interface DepartmentModel {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  name: string;
}

export interface CreateDepartmentResponseModel {
  success: boolean;
  department: DepartmentModel;
}