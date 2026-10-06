import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { calendarApi } from '../api/calendar';
import type { CalendarDay, CalendarMonth } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(dayjs());
  const [calendarData, setCalendarData] = useState<CalendarMonth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const ym = current.format('YYYY-MM');
      const res = await calendarApi.getMonth(ym);
      setCalendarData(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [current]);

  const getDayData = (date: string): CalendarDay | undefined =>
    calendarData?.days.find((d) => d.date === date);

  const startOfMonth = current.startOf('month');
  const daysInMonth = current.daysInMonth();
  const startDayOfWeek = startOfMonth.day();

  const handleDayClick = (date: string) => {
    navigate(`/calendar/${date}`);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrent((c) => c.subtract(1, 'month'))}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50"
          aria-label="이전 달"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-900">{current.format('YYYY년 M월')}</h2>
        <button
          onClick={() => setCurrent((c) => c.add(1, 'month'))}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50"
          aria-label="다음 달"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-gray-400'}`}>{d}</div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = current.date(i + 1).format('YYYY-MM-DD');
            const dayData = getDayData(date);
            const isToday = date === dayjs().format('YYYY-MM-DD');
            const dayOfWeek = (startDayOfWeek + i) % 7;
            const hasCompleted = dayData?.hasCompletedWorkout ?? false;

            return (
              <button
                key={date}
                onClick={() => handleDayClick(date)}
                className="aspect-square flex flex-col items-center justify-center rounded-xl text-xs relative hover:bg-gray-50"
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-medium
                  ${isToday
                    ? 'bg-emerald-700 text-white'
                    : hasCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : dayOfWeek === 0
                        ? 'text-red-400'
                        : dayOfWeek === 6
                          ? 'text-blue-400'
                          : 'text-gray-700'
                  }`}
                >
                  {i + 1}
                </span>
                {dayData && dayData.workoutCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayData.hasCompletedWorkout && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                    {dayData.hasInProgressWorkout && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                    {dayData.hasPlannedWorkout && <span className="w-1 h-1 rounded-full bg-sky-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />완료</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />진행중</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" />계획</div>
      </div>
    </div>
  );
}
