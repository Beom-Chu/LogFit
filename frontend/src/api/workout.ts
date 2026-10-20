import api from './client';
import type { WorkoutExercise, WorkoutSession, WorkoutSessionSummary, WorkoutSet } from '../types';

export type SetValues = Pick<WorkoutSet, 'weight' | 'reps' | 'durationSeconds' | 'distanceKm'>;

export const workoutApi = {
  createSession: (data: { workoutDate: string; status?: string; memo?: string }) =>
    api.post<{ data: WorkoutSession }>('/workout-sessions', data),
  getSession: (id: number) => api.get<{ data: WorkoutSession }>(`/workout-sessions/${id}`),
  getCurrentSession: () => api.get<{ data: WorkoutSession }>('/workout-sessions/current'),
  getPlannedSessions: () => api.get<{ data: WorkoutSessionSummary[] }>('/workout-sessions/planned'),
  getCompletedSessions: () => api.get<{ data: WorkoutSessionSummary[] }>('/workout-sessions/completed'),
  startSession: (id: number) => api.post<{ data: WorkoutSession }>(`/workout-sessions/${id}/start`),
  completeSession: (id: number) => api.post<{ data: WorkoutSession }>(`/workout-sessions/${id}/complete`),
  deleteSession: (id: number) => api.delete(`/workout-sessions/${id}`),
  updateMemo: (id: number, memo: string) => api.patch<{ data: WorkoutSession }>(`/workout-sessions/${id}/memo`, { memo }),
  addExercise: (id: number, exerciseId: number) =>
    api.post<{ data: WorkoutExercise }>(`/workout-sessions/${id}/exercises`, { exerciseId }),
  removeExercise: (workoutExerciseId: number) =>
    api.delete(`/workout-exercises/${workoutExerciseId}`),
  addSet: (workoutExerciseId: number, data: SetValues) =>
    api.post<{ data: WorkoutSet }>(`/workout-exercises/${workoutExerciseId}/sets`, data),
  updateSet: (setId: number, data: SetValues) =>
    api.put<{ data: WorkoutSet }>(`/workout-sets/${setId}`, data),
  toggleSetComplete: (setId: number) =>
    api.patch<{ data: WorkoutSet }>(`/workout-sets/${setId}/complete`),
  deleteSet: (setId: number) => api.delete(`/workout-sets/${setId}`),
};
