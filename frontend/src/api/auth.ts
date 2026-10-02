import api from './client';
import type { LoginRequest, LoginResponse, SignupRequest, UpdateProfileRequest, UserProfile } from '../types';

export const authApi = {
  login: (data: LoginRequest) => api.post<{ data: LoginResponse }>('/auth/login', data),
  signup: (data: SignupRequest) => api.post('/auth/signup', data),
  getProfile: () => api.get<{ data: UserProfile }>('/users/me'),
  updateProfile: (data: UpdateProfileRequest) => api.put<{ data: UserProfile }>('/users/me', data),
};
