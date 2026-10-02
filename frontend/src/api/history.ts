import api from './client';
import type { WorkoutHistoryDetail, WorkoutSessionSummary } from '../types';

export const historyApi = {
  getList: () => api.get<{ data: WorkoutSessionSummary[] }>('/workout-history'),
  getDetail: (id: number) => api.get<{ data: WorkoutHistoryDetail }>(`/workout-history/${id}`),
};
