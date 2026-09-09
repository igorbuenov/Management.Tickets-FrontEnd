export interface LoginResponseModel {
  accessToken: string;
  expiresAt: string;
  mustChangePassword: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    roles: string[];
  };
}

