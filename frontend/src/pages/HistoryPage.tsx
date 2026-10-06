import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyApi } from '../api/history';
import type { WorkoutSessionSummary } from '../types';
import Card from '../components/common/Card';
import Badge, { statusVariant } from '../components/common/Badge';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<WorkoutSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await historyApi.getList();
      setSessions(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="px-4 pt-5 pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">운동 이력</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : !sessions.length ? (
        <EmptyState
          message="운동 기록이 없습니다."
          description="운동을 시작해 기록을 남겨보세요."
          actionLabel="운동 시작하기"
          onAction={() => navigate('/workout/new')}
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card
              key={s.sessionId}
              className="cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate(`/history/${s.sessionId}`)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.displayName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.workoutDate}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.totalDurationMinutes && (
                    <span className="text-xs text-gray-400">{s.totalDurationMinutes}분</span>
                  )}
                  <Badge variant={statusVariant(s.status)} />
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
