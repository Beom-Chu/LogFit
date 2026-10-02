import api from './client';
import type { Exercise, PageResponse } from '../types';

export const exerciseApi = {
  list: (params?: { keyword?: string; muscleGroup?: string; favoriteOnly?: boolean; page?: number; size?: number }) =>
    api.get<{ data: PageResponse<Exercise> }>('/exercises', { params }),
  get: (id: number) => api.get<{ data: Exercise }>(`/exercises/${id}`),
  create: (data: { name: string; muscleGroup: string; trackingType: string }) =>
    api.post<{ data: Exercise }>('/exercises', data),
  update: (id: number, data: { name: string; muscleGroup: string; trackingType: string }) =>
    api.put<{ data: Exercise }>(`/exercises/${id}`, data),
  delete: (id: number) => api.delete(`/exercises/${id}`),
  addFavorite: (id: number) => api.post(`/exercises/${id}/favorite`),
  removeFavorite: (id: number) => api.delete(`/exercises/${id}/favorite`),
};
