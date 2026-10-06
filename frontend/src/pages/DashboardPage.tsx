import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import { dashboardApi } from '../api/dashboard';
import { calendarApi } from '../api/calendar';
import { workoutApi } from '../api/workout';
import type {
  CalendarDateDetail,
  CalendarMonth,
  DashboardData,
  WorkoutSession,
  WorkoutSessionSummary,
} from '../types';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { useAuthStore } from '../store/authStore';

// ─── sub-components ────────────────────────────────────────────────────────

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const FAB_ITEMS = [
  {
    label: '지금 운동 시작',
    sub: '새 운동 세션을 바로 시작합니다',
    path: '/workout/new?status=IN_PROGRESS',
    iconCls: 'text-emerald-600',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: '운동 계획 잡기',
    sub: '미래 날짜 운동을 미리 계획합니다',
    path: '/workout/new?status=PLANNED',
    iconCls: 'text-sky-600',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: '운동 이력 보기',
    sub: '완료된 운동 기록을 확인합니다',
    path: '/history',
    iconCls: 'text-gray-500',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// Inline calendar component (embedded in home, no separate page)
function InlineCalendar({
  currentMonth,
  calData,
  selectedDate,
  todayStr,
  onMonthChange,
  onDateSelect,
}: {
  currentMonth: Dayjs;
  calData: CalendarMonth | null;
  selectedDate: string;
  todayStr: string;
  onMonthChange: (d: Dayjs) => void;
  onDateSelect: (date: string) => void;
}) {
  const daysInMonth = currentMonth.daysInMonth();
  const startDow = currentMonth.startOf('month').day();

  const getDayInfo = (date: string) => calData?.days.find((d) => d.date === date);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <button
          onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="이전 달"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {currentMonth.format('YYYY년 M월')}
        </span>
        <button
          onClick={() => onMonthChange(currentMonth.add(1, 'month'))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="다음 달"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1.5 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-secondary'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-2 pb-3">
        {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
          const info = getDayInfo(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const dow = (startDow + i) % 7;
          const hasActivity = info?.hasCompletedWorkout || info?.hasInProgressWorkout;
          const hasPlanned = info?.hasPlannedWorkout;

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${
                isToday
                  ? 'bg-emerald-700 text-white'
                  : isSelected
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'hover:bg-gray-50 text-gray-900'
              } ${!isToday && dow === 0 ? 'text-red-400' : ''} ${!isToday && dow === 6 ? 'text-blue-400' : ''}`}
            >
              <span className={`text-[13px] font-medium leading-none ${isToday ? 'text-white' : ''}`}>
                {day}
              </span>
              <div className="flex gap-0.5 h-1.5">
                {hasActivity && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-600'}`} />
                )}
                {hasPlanned && (
                  <span className={`w-1.5 h-1.5 rounded-full border ${isToday ? 'border-white' : 'border-emerald-500'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Day detail session card
function DaySessionCard({ s, onGo }: { s: WorkoutSessionSummary; onGo: () => void }) {
  const isActive = s.status === 'IN_PROGRESS';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{s.displayName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
            isActive ? 'bg-emerald-100 text-emerald-700' :
            s.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
            'bg-sky-50 text-sky-700'
          }`}>
            {isActive ? '진행 중' : s.status === 'COMPLETED' ? '완료' : '계획'}
          </span>
          {s.totalDurationMinutes != null && (
            <span className="text-xs text-secondary">{s.totalDurationMinutes}분</span>
          )}
        </div>
      </div>
      <button
        onClick={onGo}
        className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-xl min-h-[40px] ${
          isActive ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'
        }`}
      >
        {isActive ? '이어서 기록' : '보기'}
      </button>
    </div>
  );
}

// ─── main page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [data, setData] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);

  // Calendar
  const today = useRef(dayjs()).current;
  const todayStr = today.format('YYYY-MM-DD');
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(today);
  const [calData, setCalData] = useState<CalendarMonth | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [dayDetail, setDayDetail] = useState<CalendarDateDetail | null>(null);
  const [dayLoading, setDayLoading] = useState(false);

  const [fabOpen, setFabOpen] = useState(false);

  // Load dashboard + current session
  const load = async () => {
    setDashLoading(true);
    setDashError(false);
    const [dashRes, sessionRes] = await Promise.allSettled([
      dashboardApi.get(),
      workoutApi.getCurrentSession(),
    ]);
    if (dashRes.status === 'fulfilled') setData(dashRes.value.data.data);
    else setDashError(true);
    if (sessionRes.status === 'fulfilled') setCurrentSession(sessionRes.value.data.data);
    setDashLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Reload calendar when month changes
  useEffect(() => {
    calendarApi.getMonth(currentMonth.format('YYYY-MM'))
      .then((r) => setCalData(r.data.data))
      .catch(() => setCalData(null));
  }, [currentMonth]);

  // Reload day detail when date selected
  useEffect(() => {
    setDayLoading(true);
    calendarApi.getDay(selectedDate)
      .then((r) => setDayDetail(r.data.data))
      .catch(() => setDayDetail(null))
      .finally(() => setDayLoading(false));
  }, [selectedDate]);

  // Derived display values
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const todayLabel = `${today.month() + 1}월 ${today.date()}일 ${dayNames[today.day()]}요일`;

  if (dashError) return <ErrorState onRetry={load} />;

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 relative">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <span className="text-2xl font-bold text-emerald-700">LogFit</span>
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0"
          aria-label="프로필"
        >
          {user?.nickname?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>

      {/* ── Hero ── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">나의 운동 기록</h1>
        <p className="text-sm text-secondary mt-1">{todayLabel}</p>
      </div>

      {dashLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <div className="grid grid-cols-2 gap-3"><SkeletonCard /><SkeletonCard /></div>
        </div>
      ) : (
        <>
          {/* ── In-progress session ── */}
          {currentSession && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 mb-2">
                  진행 중
                </span>
                <p className="font-semibold text-gray-900 truncate">{currentSession.displayName}</p>
                <p className="text-xs text-secondary mt-0.5">운동을 이어서 기록하세요</p>
              </div>
              <button
                onClick={() => navigate(`/workout/${currentSession.sessionId}`)}
                className="shrink-0 bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl min-h-[44px]"
              >
                이어서 기록
              </button>
            </div>
          )}

          {/* ── Recent Weight ── */}
          <button
            onClick={() => navigate('/body')}
            className="w-full text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-secondary mb-2">최근 체중</p>
              {data?.latestWeight ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{data.latestWeight.weight}</span>
                    <span className="text-base text-secondary">kg</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    {data.latestWeight.measureDate} 측정
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">아직 기록 없음</p>
              )}
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300 shrink-0">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>

          {/* ── Recent Workout ── */}
          <button
            onClick={() => data?.latestWorkout && navigate(`/history/${data.latestWorkout.sessionId}`)}
            className="w-full text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-secondary mb-2">최근 운동</p>
              {data?.latestWorkout ? (
                <>
                  <p className="font-semibold text-gray-900">{data.latestWorkout.workoutDate}</p>
                  {data.latestWorkout.durationMinutes != null && (
                    <p className="text-xs text-secondary mt-1">
                      {data.latestWorkout.durationMinutes}분
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">아직 기록 없음</p>
              )}
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300 shrink-0">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>

          {/* ── PR + Planned side-by-side ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* PR */}
            <button
              onClick={() => navigate('/statistics')}
              className="text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-secondary">최근 PR</p>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
              {data?.latestPrs?.[0] ? (
                <>
                  <p className="text-xs text-secondary truncate">{data.latestPrs[0].exerciseName}</p>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-2xl font-bold text-gray-900">{data.latestPrs[0].maxWeight}</span>
                    <span className="text-sm text-secondary ml-0.5">kg</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">기록 없음</p>
              )}
            </button>

            {/* Planned */}
            <button
              onClick={() => data?.plannedWorkout && navigate(`/workout/${data.plannedWorkout.sessionId}`)}
              className="text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-secondary">예정 운동</p>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
              {data?.plannedWorkout ? (
                <p className="font-semibold text-gray-900 mt-0.5">{data.plannedWorkout.workoutDate}</p>
              ) : (
                <p className="text-sm text-gray-400">없음</p>
              )}
            </button>
          </div>
        </>
      )}

      {/* ── Calendar ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">운동 캘린더</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />완료
            </span>
            <span className="flex items-center gap-1 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full border border-emerald-500 inline-block" />계획
            </span>
          </div>
        </div>

        <InlineCalendar
          currentMonth={currentMonth}
          calData={calData}
          selectedDate={selectedDate}
          todayStr={todayStr}
          onMonthChange={setCurrentMonth}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* ── Selected date detail ── */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {dayjs(selectedDate).format('M월 D일')}
        </h3>
        {dayLoading ? (
          <SkeletonCard />
        ) : !dayDetail?.sessions.length ? (
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
            <p className="text-sm text-secondary">운동 기록이 없습니다.</p>
            <button
              onClick={() => navigate(`/workout/new?date=${selectedDate}`)}
              className="text-sm text-emerald-700 font-medium mt-2 underline"
            >
              운동 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayDetail.sessions.map((s) => (
              <DaySessionCard
                key={s.sessionId}
                s={s}
                onGo={() => navigate(`/workout/${s.sessionId}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FAB backdrop ── */}
      {fabOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setFabOpen(false)} />
      )}

      {/* ── FAB ── */}
      <div className="fixed bottom-20 right-4 flex flex-col items-end gap-2 z-50">
        {fabOpen && (
          <div className="flex flex-col gap-2 items-end mb-1">
            {FAB_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => { setFabOpen(false); navigate(item.path); }}
                className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-4 py-3 border border-gray-100 text-left min-w-[200px]"
              >
                <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 ${item.iconCls}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-secondary">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-14 h-14 bg-emerald-700 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95"
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
