import { create } from 'zustand';
import type { LoginResponse } from '../types';

interface AuthState {
  token: string | null;
  user: Omit<LoginResponse, 'accessToken'> | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })(),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (data) => {
    localStorage.setItem('token', data.accessToken);
    const user = { userId: data.userId, nickname: data.nickname, email: data.email };
    localStorage.setItem('user', JSON.stringify(user));
    set({ token: data.accessToken, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
