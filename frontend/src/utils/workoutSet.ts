import type { TrackingType, WorkoutSet } from '../types';

export type SetField = 'weight' | 'reps' | 'duration' | 'distance';

export const SET_FIELDS: Record<TrackingType, SetField[]> = {
  WEIGHT_REPS: ['weight', 'reps'],
  ASSIST_WEIGHT_REPS: ['weight', 'reps'],
  REPS_ONLY: ['reps'],
  TIME_ONLY: ['duration'],
  DISTANCE_TIME: ['distance', 'duration'],
};

export function fieldLabel(field: SetField, trackingType: TrackingType): string {
  switch (field) {
    case 'weight': return trackingType === 'ASSIST_WEIGHT_REPS' ? '보조 kg' : '중량 kg';
    case 'reps': return '횟수';
    case 'duration': return '시간(분)';
    case 'distance': return '거리(km)';
  }
}

export const secondsToMinutes = (seconds: number) => Math.round((seconds / 60) * 100) / 100;
export const minutesToSeconds = (minutes: number) => Math.round(minutes * 60);

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return s > 0 ? `${m}분 ${s}초` : `${m}분`;
  return `${s}초`;
}

type SetValues = Pick<WorkoutSet, 'weight' | 'reps' | 'durationSeconds' | 'distanceKm'>;

export function formatSet(trackingType: TrackingType, set: SetValues): string {
  switch (trackingType) {
    case 'WEIGHT_REPS': return `${set.weight}kg × ${set.reps}회`;
    case 'ASSIST_WEIGHT_REPS': return `보조 ${set.weight}kg × ${set.reps}회`;
    case 'REPS_ONLY': return `${set.reps}회`;
    case 'TIME_ONLY': return formatDuration(set.durationSeconds);
    case 'DISTANCE_TIME': return `${set.distanceKm}km · ${formatDuration(set.durationSeconds)}`;
  }
}
