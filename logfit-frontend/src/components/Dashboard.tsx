import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  authLogout,
  getWeeklyWorkoutSummary,
  getWorkoutRecords,
  getExerciseTypes,
  ExerciseType,
  WorkoutRecordResponse,
} from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roles: string[];
  weightKg?: number;
  heightCm?: number;
  birthDate?: string;
}

function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toDateKey(dateTime: string) {
  const date = new Date(dateTime);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Exercise image mapping 추가
const EXERCISE_IMAGE_BY_KEY: Record<string, string> = {
  benchpress: '/exercises/bench-press.svg',
  squat: '/exercises/squat.svg',
  deadlift: '/exercises/deadlift.svg',
  overheadpress: '/exercises/overhead-press.svg',
  pullup: '/exercises/pull-up.svg',
  barbellrow: '/exercises/barbell-row.svg',
  lunge: '/exercises/lunge.svg',
  legpress: '/exercises/leg-press.svg',
};

const EXERCISE_NAME_ALIASES: Record<string, string[]> = {
  benchpress: ['벤치프레스', '벤치 프레스', 'benchpress', 'bench press'],
  squat: ['스쿼트', 'squat'],
  deadlift: ['데드리프트', 'deadlift', 'dead lift'],
  overheadpress: ['오버헤드 프레스', '오버헤드프레스', 'overhead press', 'shoulder press'],
  pullup: ['풀업', '턱걸이', 'pullup', 'pull up', 'chin up'],
  barbellrow: ['바벨 로우', '바벨로우', '바벨로', 'barbell row', 'bent over row'],
  lunge: ['런지', 'lunge'],
  legpress: ['레그 프레스', '레그프레스', 'leg press'],
};

function normalizeExerciseName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '');
}

function resolveExerciseImage(name: string) {
  const normalizedName = normalizeExerciseName(name);

  for (const [key, aliases] of Object.entries(EXERCISE_NAME_ALIASES)) {
    const matched = aliases.some((alias) => normalizeExerciseName(alias) === normalizedName);
    if (matched) {
      return EXERCISE_IMAGE_BY_KEY[key] || '/exercises/workout-default.svg';
    }
  }

  return '/exercises/workout-default.svg';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDays, setActiveDays] = useState(0);
  const [allRecords, setAllRecords] = useState<WorkoutRecordResponse[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateKey());

  const selectedDateRecords = useMemo(() => {
    return allRecords.filter((r) => toDateKey(r.performedAt) === selectedDate);
  }, [allRecords, selectedDate]);

  const dailyStats = useMemo(() => {
    const count = selectedDateRecords.length;
    const totalVolume = selectedDateRecords.reduce(
      (sum, r) => sum + Number(r.weightKg) * r.reps,
      0
    );
    return { count, totalVolume: Math.round(totalVolume * 10) / 10 };
  }, [selectedDateRecords]);

  const groupedRecentRecords = useMemo(() => {
    const grouped = new Map<string, WorkoutRecordResponse[]>();

    selectedDateRecords
      .slice()
      .sort((a, b) => a.setCount - b.setCount)
      .forEach((record) => {
        const current = grouped.get(record.exerciseName) || [];
        current.push(record);
        grouped.set(record.exerciseName, current);
      });

    return Array.from(grouped.entries());
  }, [selectedDateRecords]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [userResponse, summaryResponse, recordsResponse, exerciseResponse] = await Promise.all([
        getCurrentUser(),
        getWeeklyWorkoutSummary(),
        getWorkoutRecords(),
        getExerciseTypes(),
      ]);

      setUser(userResponse.data);
      setActiveDays(summaryResponse.data.activeDays);
      setAllRecords(recordsResponse.data);
      setExerciseTypes(exerciseResponse.data);
    } catch (err) {
      console.error('대시보드 데이터 조회 실패:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!user) return;
    try {
      await authLogout(user.id);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (err) {
      console.error('로그아웃 실패:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const handleStartWorkout = () => {
    navigate(`/workouts/new/${selectedDate}`);
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <p className="text-white text-lg">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <p className="text-white text-lg">사용자 정보를 로드할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-blue-100 text-sm">로그인 후 첫 화면</p>
            <h1 className="text-3xl font-bold text-white">{user.username}님, 오늘도 기록해볼까요?</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>

        <div className="bg-white/95 rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800">오늘의 시작</h2>
          <p className="text-gray-600 mt-2">운동을 빠르게 시작하고 날짜별 변화를 확인하세요.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleStartWorkout}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              오늘 운동 시작
            </button>
            <button
              onClick={handleEditProfile}
              className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              프로필 수정
            </button>
          </div>
        </div>

        <div className="bg-white/95 rounded-xl shadow-xl p-4 flex items-center gap-4">
          <label className="text-gray-700 font-medium whitespace-nowrap">📅 날짜 선택</label>
          <input
            type="date"
            value={selectedDate}
            max={getTodayDateKey()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {selectedDate !== getTodayDateKey() && (
            <button
              onClick={() => setSelectedDate(getTodayDateKey())}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              오늘로 돌아가기
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">
              {selectedDate === getTodayDateKey() ? '오늘' : selectedDate} 운동 횟수
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dailyStats.count}세트</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">
              {selectedDate === getTodayDateKey() ? '오늘' : selectedDate} 총 볼륨
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dailyStats.totalVolume.toLocaleString()}kg</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">이번 주 운동 일수</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{activeDays}일</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedDate === getTodayDateKey() ? '오늘' : selectedDate} 운동 기록
              </h3>
              <button
                onClick={handleStartWorkout}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                기록 추가
              </button>
            </div>

            {groupedRecentRecords.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-5 mt-4 text-center">
                <p className="text-gray-600">
                  {selectedDate === getTodayDateKey()
                    ? '아직 오늘 운동 기록이 없습니다.'
                    : `${selectedDate}에 기록된 운동이 없습니다.`}
                </p>
                <p className="text-gray-500 text-sm mt-1">첫 기록을 남기면 여기에 운동이 표시됩니다.</p>
                <button
                  onClick={handleStartWorkout}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  기록 만들기
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {groupedRecentRecords.map(([exerciseName, records]) => {
                  const isDefaultExercise = exerciseTypes.some(
                    (e) => e.name === exerciseName && e.isDefault
                  );

                  return (
                    <div key={exerciseName} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex">
                        {isDefaultExercise && (
                          <img
                            src={resolveExerciseImage(exerciseName)}
                            alt={exerciseName}
                            className="w-32 h-32 object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 p-4">
                          <p className="font-semibold text-gray-800 mb-2">{exerciseName}</p>
                          <ul className="space-y-1">
                            {records.map((record) => (
                              <li key={record.id} className="text-sm text-gray-600">
                                {record.setCount}세트 - {record.weightKg}kg × {record.reps}회
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">내 프로필</h3>
              <button
                onClick={handleEditProfile}
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                수정
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs">이름</p>
                <p className="text-gray-800 font-semibold">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">이메일</p>
                <p className="text-gray-800 font-semibold">{user.email}</p>
              </div>
              {user.weightKg != null && (
                <div>
                  <p className="text-gray-500 text-xs">체중</p>
                  <p className="text-gray-800 font-semibold">{user.weightKg} kg</p>
                </div>
              )}
              {user.heightCm != null && (
                <div>
                  <p className="text-gray-500 text-xs">키</p>
                  <p className="text-gray-800 font-semibold">{user.heightCm} cm</p>
                </div>
              )}
              {user.birthDate && (
                <div>
                  <p className="text-gray-500 text-xs">생년월일</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(user.birthDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs">가입일</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">계정 상태</p>
                <p className="text-gray-800 font-semibold">
                  {user.isActive ? '활성' : '비활성'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
