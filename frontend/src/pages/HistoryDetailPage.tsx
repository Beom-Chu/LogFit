import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { historyApi } from '../api/history';
import type { WorkoutHistoryDetail } from '../types';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

export default function HistoryDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
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
    <div className="pb-6">
      <PageHeader
        title={data?.displayName || '운동 상세'}
        subtitle={data?.workoutDate}
      />

      <div className="px-4">
        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : data ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              {data.durationMinutes && (
                <div className="bg-gray-50 rounded-xl p-3 flex-1 text-center">
                  <p className="text-xs text-gray-400">운동시간</p>
                  <p className="text-lg font-bold text-gray-700">{data.durationMinutes}분</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3 flex-1 text-center">
                <p className="text-xs text-gray-400">운동 수</p>
                <p className="text-lg font-bold text-gray-700">{data.exercises.length}</p>
              </div>
            </div>

            {data.exercises.map((ex) => (
              <Card key={ex.workoutExerciseId}>
                <p className="font-semibold text-gray-900 mb-3">{ex.exerciseName}</p>
                <div className="space-y-1">
                  {ex.sets.map((set) => (
                    <div
                      key={set.setOrder}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm
                        ${set.completed ? 'bg-emerald-50' : ''}`}
                    >
                      <span className="text-gray-400 w-5 text-center shrink-0">{set.setOrder}</span>
                      <span className="text-gray-200 shrink-0">|</span>
                      <span className="font-medium text-gray-700 w-14 shrink-0">{set.weight}kg</span>
                      <span className="text-gray-400 text-xs shrink-0">×</span>
                      <span className="text-gray-700">{set.reps}회</span>
                      {set.completed && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600 ml-auto shrink-0">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
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
    </div>
  );
}
