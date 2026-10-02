import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyApi } from '../api/history';
import type { WorkoutSessionSummary } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <h2 className="text-lg font-bold">운동 이력</h2>
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : !sessions.length ? (
        <EmptyState message="운동 기록이 없습니다." actionLabel="운동 시작하기" onAction={() => navigate('/workout/new')} />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card
              key={s.sessionId}
              className="cursor-pointer"
              onClick={() => navigate(`/history/${s.sessionId}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{s.displayName}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.workoutDate}</p>
                </div>
                <div className="text-right">
                  {s.totalDurationMinutes && (
                    <p className="text-sm text-gray-600">{s.totalDurationMinutes}분</p>
                  )}
                  <p className="text-xs text-gray-400">›</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
