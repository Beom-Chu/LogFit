import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calendarApi } from '../api/calendar';
import type { CalendarDateDetail } from '../types';
import Card from '../components/common/Card';
import Badge, { statusVariant } from '../components/common/Badge';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

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
    <div className="pb-6">
      <PageHeader title={date ?? ''} />

      <div className="px-4">
        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : !data?.sessions.length ? (
          <EmptyState
            message="이날 운동 기록이 없습니다"
            description="운동을 계획하거나 기록을 추가해보세요."
            actionLabel="운동 계획하기"
            onAction={() => navigate(`/workout/new?date=${date}&status=PLANNED`)}
          />
        ) : (
          <div className="space-y-3">
            {data.sessions.map((s) => (
              <Card
                key={s.sessionId}
                className="cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => navigate(`/workout/${s.sessionId}`)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.displayName}</p>
                    {s.totalDurationMinutes && (
                      <p className="text-xs text-gray-400 mt-0.5">{s.totalDurationMinutes}분</p>
                    )}
                  </div>
                  <Badge variant={statusVariant(s.status)} />
                </div>
              </Card>
            ))}
            <Button variant="ghost" fullWidth onClick={() => navigate(`/workout/new?date=${date}&status=PLANNED`)}>
              + 운동 추가
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
