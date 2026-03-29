import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ExerciseType {
  id: number;
  name: string;
  isDefault: boolean;
  createdByUserId: number | null;
}

export interface WorkoutRecordRequest {
  exerciseTypeId: number;
  weightKg: number;
  reps: number;
  setCount: number;
  performedAt?: string;
}

export interface WorkoutRecordResponse {
  id: number;
  exerciseTypeId: number;
  exerciseName: string;
  weightKg: number;
  reps: number;
  setCount: number;
  performedAt: string;
}

export interface WeeklyWorkoutSummary {
  workoutCount: number;
  totalVolume: number;
  activeDays: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: 토큰이 있으면 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 401 Unauthorized 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403: 토큰 삭제 후 로그인 이동 (무한루프 방지)
    if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그인 페이지로 이동
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// 회원가입
export const authSignup = (data: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => api.post('/auth/signup', data);

// 로그인
export const authLogin = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

// 게스트 로그인
export const authGuestLogin = () =>
  api.post('/auth/guest');

// 로그아웃
export const authLogout = (userId: number) =>
  api.post('/auth/logout', {}, { headers: { 'X-User-Id': userId.toString() } });

// 현재 사용자 조회
export const getCurrentUser = () => api.get('/users/me');

// 사용자 정보 수정
export const updateProfile = (data: {
  username?: string;
  weightKg?: number;
  heightCm?: number;
  birthDate?: string;
}) => api.put('/users/me', data);

// 토큰 갱신
export const refreshToken = (refreshToken: string) =>
  api.post('/auth/refresh', { refreshToken });

// 운동 종류 조회 (기본 + 내 커스텀)
export const getExerciseTypes = () => api.get<ExerciseType[]>('/exercises');

// 커스텀 운동 종류 생성
export const createExerciseType = (name: string) =>
  api.post<ExerciseType>('/exercises', { name });

// 운동 기록 생성
export const createWorkoutRecord = (data: WorkoutRecordRequest) =>
  api.post<WorkoutRecordResponse>('/workouts', data);

// 운동 기록 수정
export const updateWorkoutRecord = (recordId: number, data: WorkoutRecordRequest) =>
  api.put<WorkoutRecordResponse>(`/workouts/${recordId}`, data);

// 운동 기록 삭제
export const deleteWorkoutRecord = (recordId: number) =>
  api.delete(`/workouts/${recordId}`);

// 내 운동 기록 조회
export const getWorkoutRecords = () => api.get<WorkoutRecordResponse[]>('/workouts');

// 주간 요약 조회
export const getWeeklyWorkoutSummary = () =>
  api.get<WeeklyWorkoutSummary>('/workouts/summary/weekly');

export default api;
