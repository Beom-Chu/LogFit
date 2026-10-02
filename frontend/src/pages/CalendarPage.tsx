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
        <button onClick={() => setCurrent((c) => c.subtract(1, 'month'))} className="p-2 rounded-full hover:bg-gray-100">‹</button>
        <h2 className="text-lg font-bold">{current.format('YYYY년 M월')}</h2>
        <button onClick={() => setCurrent((c) => c.add(1, 'month'))} className="p-2 rounded-full hover:bg-gray-100">›</button>
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

            return (
              <button
                key={date}
                onClick={() => handleDayClick(date)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs relative
                  ${isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                  ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : ''}`}
              >
                <span className={`font-medium ${isToday ? 'text-white' : ''}`}>{i + 1}</span>
                {dayData && dayData.workoutCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayData.hasCompletedWorkout && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    {dayData.hasInProgressWorkout && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                    {dayData.hasPlannedWorkout && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />완료</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />진행중</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" />계획</div>
      </div>
    </div>
  );
}
