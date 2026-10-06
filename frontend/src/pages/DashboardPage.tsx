import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { dashboardApi } from '../api/dashboard';
import type { DashboardData } from '../types';
import Card from '../components/common/Card';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { useAuthStore } from '../store/authStore';

const FAB_ITEMS = [
  {
    label: '지금 운동 시작',
    sub: '새 운동 세션을 시작합니다',
    path: '/workout/new?status=IN_PROGRESS',
    color: 'text-emerald-700',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: '운동 계획 잡기',
    sub: '미래 날짜 운동을 미리 계획합니다',
    path: '/workout/new?status=PLANNED',
    color: 'text-sky-700',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-sky-600">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: '운동 이력 보기',
    sub: '완료된 운동 기록을 확인합니다',
    path: '/history',
    color: 'text-gray-700',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

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

  const now = dayjs();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const today = `${now.month() + 1}월 ${now.date()}일 ${dayNames[now.day()]}요일`;

  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="px-4 pt-5 pb-6 space-y-4 relative">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs text-gray-400 font-medium">{today}</p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">
            안녕하세요, {user?.nickname}님
          </h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0 mt-0.5"
        >
          {user?.nickname?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard lines={3} />
        </div>
      ) : (
        <>
          {/* ── Planned Workout (prominent CTA) ── */}
          {data?.plannedWorkout && (
            <button
              onClick={() => navigate(`/workout/${data.plannedWorkout!.sessionId}`)}
              className="w-full text-left"
            >
              <Card variant="accent" className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-0.5">예정된 운동</p>
                  <p className="font-semibold text-gray-900">{data.plannedWorkout.workoutDate}</p>
                  <p className="text-xs text-gray-400 mt-0.5">탭해서 운동 시작</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-700">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </Card>
            </button>
          )}

          {/* ── Weight + Workout row ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Latest Weight */}
            <button onClick={() => navigate('/body')} className="text-left">
              <Card className="h-full">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">최근 체중</p>
                {data?.latestWeight ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900 leading-none">
                      {data.latestWeight.weight}
                      <span className="text-sm font-medium text-gray-400 ml-0.5">kg</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5">측정: {data.latestWeight.measureDate}</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-300">—</p>
                    <p className="text-[11px] text-gray-400 mt-1">아직 기록 없음</p>
                  </>
                )}
              </Card>
            </button>

            {/* Latest Workout */}
            <button onClick={() => navigate('/history')} className="text-left">
              <Card className="h-full">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">최근 운동</p>
                {data?.latestWorkout ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      {data.latestWorkout.workoutDate}
                    </p>
                    {data.latestWorkout.durationMinutes && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {data.latestWorkout.durationMinutes}분 소요
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-300">—</p>
                    <p className="text-[11px] text-gray-400 mt-1">아직 기록 없음</p>
                  </>
                )}
              </Card>
            </button>
          </div>

          {/* ── Latest PRs ── */}
          {data?.latestPrs && data.latestPrs.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">최근 PR</p>
                <button
                  onClick={() => navigate('/statistics')}
                  className="text-xs text-emerald-700 font-medium"
                >
                  전체 보기
                </button>
              </div>
              <div className="space-y-2">
                {data.latestPrs.slice(0, 3).map((pr) => (
                  <div key={pr.exerciseId} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700 truncate mr-2">{pr.exerciseName}</span>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-emerald-700">{pr.maxWeight}kg</span>
                      <span className="text-xs text-gray-400 ml-1">× {pr.repsAtMaxWeight}회</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── FAB backdrop ── */}
      {fabOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* ── FAB ── */}
      <div className="fixed bottom-20 right-4 flex flex-col items-end gap-2 z-50">
        {fabOpen && (
          <div className="flex flex-col gap-2 items-end mb-1">
            {FAB_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => { setFabOpen(false); navigate(item.path); }}
                className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-4 py-3 border border-gray-100 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-14 h-14 bg-emerald-700 rounded-full shadow-lg flex items-center justify-center text-white transition-transform active:scale-95"
          style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          aria-label="운동 메뉴 열기"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
