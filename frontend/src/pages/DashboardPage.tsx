import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import type { DashboardData } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await dashboardApi.get();
      setData(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="px-4 py-6 space-y-4 relative">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900">안녕하세요, {user?.nickname}님 👋</h1>
      </div>

      {/* Latest Weight */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">최근 체중</p>
            {data?.latestWeight ? (
              <>
                <p className="text-2xl font-bold text-gray-900">{data.latestWeight.weight}kg</p>
                <p className="text-xs text-gray-400 mt-0.5">{data.latestWeight.measureDate}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">기록 없음</p>
            )}
          </div>
          <button onClick={() => navigate('/body')} className="text-blue-600 text-sm font-medium">관리 →</button>
        </div>
      </Card>

      {/* Latest Workout */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">최근 운동</p>
            {data?.latestWorkout ? (
              <>
                <p className="text-base font-semibold text-gray-900">{data.latestWorkout.workoutDate}</p>
                {data.latestWorkout.durationMinutes && (
                  <p className="text-xs text-gray-400">{data.latestWorkout.durationMinutes}분</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">기록 없음</p>
            )}
          </div>
          <button onClick={() => navigate('/history')} className="text-blue-600 text-sm font-medium">이력 →</button>
        </div>
      </Card>

      {/* PRs */}
      {data?.latestPrs && data.latestPrs.length > 0 && (
        <Card>
          <p className="text-xs text-gray-400 mb-2">최근 PR</p>
          <div className="space-y-2">
            {data.latestPrs.slice(0, 3).map((pr) => (
              <div key={pr.exerciseId} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{pr.exerciseName}</span>
                <span className="text-sm font-bold text-blue-600">{pr.maxWeight}kg × {pr.repsAtMaxWeight}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/statistics')} className="text-blue-600 text-sm font-medium mt-2 block">통계 보기 →</button>
        </Card>
      )}

      {/* Planned Workout */}
      {data?.plannedWorkout && (
        <Card className="border-l-4 border-l-orange-400">
          <p className="text-xs text-gray-400 mb-1">예정 운동</p>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900">{data.plannedWorkout.workoutDate}</p>
            <button
              onClick={() => navigate(`/workout/${data.plannedWorkout!.sessionId}`)}
              className="text-orange-500 text-sm font-medium"
            >
              시작 →
            </button>
          </div>
        </Card>
      )}

      {/* FAB */}
      <div className="fixed bottom-20 right-6 flex flex-col items-end gap-2 z-50">
        {fabOpen && (
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={() => { setFabOpen(false); navigate('/workout/new?status=IN_PROGRESS'); }}
              className="bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-100"
            >
              🏋️ 현재 운동 시작
            </button>
            <button
              onClick={() => { setFabOpen(false); navigate('/history'); }}
              className="bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-100"
            >
              📋 과거 운동 기록
            </button>
            <button
              onClick={() => { setFabOpen(false); navigate('/workout/new?status=PLANNED'); }}
              className="bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-100"
            >
              📅 미래 운동 계획
            </button>
          </div>
        )}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform"
          style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </button>
      </div>
    </div>
  );
}
