import api from './client';
import type { BodyComposition, BodyCompositionChartPoint, BodyWeight, BodyWeightChartPoint } from '../types';

export const bodyApi = {
  // Body Weight
  createWeight: (data: { weight: number; measureDate: string }) =>
    api.post<{ data: BodyWeight }>('/body-weights', data),
  getWeights: () => api.get<{ data: BodyWeight[] }>('/body-weights'),
  getLatestWeight: () => api.get<{ data: BodyWeight }>('/body-weights/latest'),
  getWeight: (id: number) => api.get<{ data: BodyWeight }>(`/body-weights/${id}`),
  updateWeight: (id: number, data: { weight: number; measureDate: string }) =>
    api.put<{ data: BodyWeight }>(`/body-weights/${id}`, data),
  deleteWeight: (id: number) => api.delete(`/body-weights/${id}`),
  getWeightChart: (params?: { from?: string; to?: string }) =>
    api.get<{ data: BodyWeightChartPoint[] }>('/body-weights/chart', { params }),

  // Body Composition
  createComposition: (data: { weight: number; skeletalMuscleMass: number; bodyFatPercentage: number; measureDate: string }) =>
    api.post<{ data: BodyComposition }>('/body-compositions', data),
  getCompositions: () => api.get<{ data: BodyComposition[] }>('/body-compositions'),
  getLatestComposition: () => api.get<{ data: BodyComposition }>('/body-compositions/latest'),
  getComposition: (id: number) => api.get<{ data: BodyComposition }>(`/body-compositions/${id}`),
  updateComposition: (id: number, data: { weight: number; skeletalMuscleMass: number; bodyFatPercentage: number; measureDate: string }) =>
    api.put<{ data: BodyComposition }>(`/body-compositions/${id}`, data),
  deleteComposition: (id: number) => api.delete(`/body-compositions/${id}`),
  getCompositionChart: (params?: { from?: string; to?: string }) =>
    api.get<{ data: BodyCompositionChartPoint[] }>('/body-compositions/chart', { params }),
};
