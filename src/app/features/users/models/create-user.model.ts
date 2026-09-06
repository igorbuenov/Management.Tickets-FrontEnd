export interface UserModel {
  name: string;
  email: string;
  roleID: number;
}

export interface CreateUserModel {
  name: string;
  email: string;
  roleID: number;
}

export interface CreateUserResponseModel {
  success: boolean;
  user: UserModel;
}
