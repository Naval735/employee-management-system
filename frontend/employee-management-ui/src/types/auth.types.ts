export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'HR';
  employeeId?: number;
  fullName?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
