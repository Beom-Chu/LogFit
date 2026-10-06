export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

// Auth
export interface LoginRequest { email: string; password: string; }
export interface SignupRequest { email: string; nickname: string; password: string; }
export interface LoginResponse { accessToken: string; userId: number; nickname: string; email: string; }

// User
export interface UserProfile { userId: number; email: string; nickname: string; height?: number; gender?: string; createdAt: string; }
export interface UpdateProfileRequest { nickname: string; height?: number; gender?: string; }

// Exercise
export type MuscleGroup = 'CHEST' | 'BACK' | 'SHOULDER' | 'LEG' | 'ARM' | 'ABS' | 'CARDIO' | 'ETC';
export type TrackingType = 'WEIGHT_REPS' | 'REPS_ONLY' | 'DURATION' | 'DISTANCE';
export type ExerciseSourceType = 'SYSTEM' | 'CUSTOM';

export interface Exercise {
  exerciseId: number;
  name: string;
  muscleGroup: MuscleGroup;
  trackingType: TrackingType;
  sourceType: ExerciseSourceType;
  isFavorite: boolean;
}

// Workout Session
export type WorkoutSessionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface WorkoutSet {
  workoutSetId: number;
  setOrder: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  workoutExerciseId: number;
  exerciseId: number;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  trackingType?: TrackingType; // optional – depends on backend version
  exerciseOrder: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  sessionId: number;
  userId: number;
  workoutDate: string;
  status: WorkoutSessionStatus;
  startTime?: string;
  endTime?: string;
  totalDurationMinutes?: number;
  memo?: string;
  displayName: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutSessionSummary {
  sessionId: number;
  workoutDate: string;
  status: WorkoutSessionStatus;
  displayName: string;
  totalDurationMinutes?: number;
}

// Body Weight
export interface BodyWeight { weightId: number; weight: number; measureDate: string; createdAt: string; }
export interface BodyWeightChartPoint { date: string; weight: number; }

// Body Composition
export interface BodyComposition {
  bodyCompositionId: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatPercentage: number;
  measureDate: string;
  createdAt: string;
}
export interface BodyCompositionChartPoint { date: string; weight: number; skeletalMuscleMass: number; bodyFatPercentage: number; }

// Calendar
export interface CalendarDay {
  date: string;
  hasPlannedWorkout: boolean;
  hasCompletedWorkout: boolean;
  hasInProgressWorkout: boolean;
  workoutCount: number;
  totalDurationMinutes?: number;
}
export interface CalendarMonth { yearMonth: string; days: CalendarDay[]; }
export interface CalendarDateDetail { date: string; sessions: WorkoutSessionSummary[]; }

// Dashboard
export interface DashboardData {
  latestWeight?: { weight: number; measureDate: string };
  latestWorkout?: { sessionId: number; workoutDate: string; durationMinutes?: number };
  plannedWorkout?: { sessionId: number; workoutDate: string };
  latestPrs: PrData[];
}

// Statistics
export interface PrData { exerciseId: number; exerciseName: string; maxWeight: number; repsAtMaxWeight: number; achievedDate: string; }
export interface OneRmData { exerciseId: number; exerciseName: string; estimated1RM: number; achievedDate: string; }
export interface VolumePoint { date: string; totalVolume: number; }
export interface MuscleShare { muscleGroup: string; count: number; percentage: number; }
export interface MuscleDistribution { distribution: MuscleShare[]; }
export interface WorkoutSummary { totalWorkouts: number; totalSets: number; totalVolumeKg: number; avgDurationMinutes?: number; currentStreak: number; longestStreak: number; }

// History
export interface WorkoutHistoryDetail {
  sessionId: number;
  workoutDate: string;
  displayName: string;
  durationMinutes?: number;
  memo?: string;
  exercises: Array<{
    workoutExerciseId: number;
    exerciseName: string;
    sets: Array<{ setOrder: number; weight: number; reps: number; completed: boolean }>;
  }>;
}
