import api from './client';
import type { WorkoutSession, WorkoutSessionSummary } from '../types';

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
    api.post<{ data: WorkoutSession }>(`/workout-sessions/${id}/exercises`, { exerciseId }),
  removeExercise: (sessionId: number, workoutExerciseId: number) =>
    api.delete(`/workout-sessions/${sessionId}/exercises/${workoutExerciseId}`),
  addSet: (sessionId: number, workoutExerciseId: number, data: { weight: number; reps: number }) =>
    api.post<{ data: WorkoutSession }>(`/workout-sessions/${sessionId}/exercises/${workoutExerciseId}/sets`, data),
  updateSet: (sessionId: number, workoutExerciseId: number, setId: number, data: { weight: number; reps: number; completed: boolean }) =>
    api.put<{ data: WorkoutSession }>(`/workout-sessions/${sessionId}/exercises/${workoutExerciseId}/sets/${setId}`, data),
  deleteSet: (sessionId: number, workoutExerciseId: number, setId: number) =>
    api.delete(`/workout-sessions/${sessionId}/exercises/${workoutExerciseId}/sets/${setId}`),
};
