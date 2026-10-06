import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { historyApi } from '../api/history';
import type { WorkoutHistoryDetail } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

export default function HistoryDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkoutHistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await historyApi.getDetail(Number(sessionId));
      setData(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [sessionId]);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <div>
          <h2 className="text-lg font-bold">{data?.displayName || '운동 상세'}</h2>
          {data && <p className="text-xs text-gray-400">{data.workoutDate}</p>}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : data ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            {data.durationMinutes && (
              <div className="bg-emerald-50 rounded-xl p-3 flex-1 text-center">
                <p className="text-xs text-blue-400">운동시간</p>
                <p className="text-lg font-bold text-emerald-700">{data.durationMinutes}분</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3 flex-1 text-center">
              <p className="text-xs text-gray-400">운동 수</p>
              <p className="text-lg font-bold text-gray-700">{data.exercises.length}</p>
            </div>
          </div>

          {data.exercises.map((ex) => (
            <Card key={ex.workoutExerciseId}>
              <p className="font-semibold text-gray-900 mb-2">{ex.exerciseName}</p>
              <div className="space-y-1">
                {ex.sets.map((set) => (
                  <div key={set.setOrder} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm
                    ${set.completed ? 'bg-emerald-50' : ''}`}>
                    <span className="text-gray-400 w-5">{set.setOrder}</span>
                    <span className="text-gray-700">{set.weight}kg × {set.reps}회</span>
                    {set.completed && <span className="text-emerald-600 ml-auto text-xs">✓</span>}
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {data.memo && (
            <Card>
              <p className="text-xs text-gray-400 mb-1">메모</p>
              <p className="text-sm text-gray-700">{data.memo}</p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
