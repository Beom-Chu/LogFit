import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calendarApi } from '../api/calendar';
import type { CalendarDateDetail } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const STATUS_LABELS: Record<string, string> = {
  PLANNED: '계획',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
};

const STATUS_COLORS: Record<string, string> = {
  PLANNED: 'bg-orange-100 text-orange-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-emerald-100 text-blue-700',
};

export default function CalendarDayPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CalendarDateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!date) return;
    setLoading(true);
    setError(false);
    try {
      const res = await calendarApi.getDay(date);
      setData(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [date]);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <h2 className="text-lg font-bold">{date}</h2>
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : !data?.sessions.length ? (
        <EmptyState
          message="운동 기록이 없습니다."
          actionLabel="운동 계획하기"
          onAction={() => navigate(`/workout/new?date=${date}&status=PLANNED`)}
        />
      ) : (
        <div className="space-y-3">
          {data.sessions.map((s) => (
            <Card key={s.sessionId} className="cursor-pointer" onClick={() => navigate(`/workout/${s.sessionId}`)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{s.displayName}</p>
                  {s.totalDurationMinutes && (
                    <p className="text-xs text-gray-400 mt-1">{s.totalDurationMinutes}분</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[s.status]}`}>
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
            </Card>
          ))}
          <Button variant="ghost" fullWidth onClick={() => navigate(`/workout/new?date=${date}&status=PLANNED`)}>
            + 운동 추가
          </Button>
        </div>
      )}
    </div>
  );
}
