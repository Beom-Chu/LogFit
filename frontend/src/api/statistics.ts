import api from './client';
import type { BodyCompositionChartPoint, MuscleDistribution, OneRmData, PrData, VolumePoint, WorkoutSummary } from '../types';

export const statisticsApi = {
  getPRs: () => api.get<{ data: PrData[] }>('/statistics/pr'),
  get1RMs: () => api.get<{ data: OneRmData[] }>('/statistics/1rm'),
  getVolume: (params?: { from?: string; to?: string }) =>
    api.get<{ data: VolumePoint[] }>('/statistics/volume', { params }),
  getMuscleDistribution: () => api.get<{ data: MuscleDistribution }>('/statistics/muscles'),
  getBodyTrend: (params?: { from?: string; to?: string }) =>
    api.get<{ data: BodyCompositionChartPoint[] }>('/statistics/body', { params }),
  getWorkoutSummary: () => api.get<{ data: WorkoutSummary }>('/statistics/workout-summary'),
};
