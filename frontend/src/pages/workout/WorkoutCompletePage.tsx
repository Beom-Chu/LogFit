import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutApi } from '../../api/workout';
import type { WorkoutSession } from '../../types';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function WorkoutCompletePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    workoutApi.getSession(Number(sessionId))
      .then((res) => setSession(res.data.data))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!session) return null;

  const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">운동 완료!</h1>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="text-center">
          <p className="text-xs text-gray-400">총 운동시간</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {session.totalDurationMinutes != null
              ? `${Math.floor(session.totalDurationMinutes / 60) > 0 ? `${Math.floor(session.totalDurationMinutes / 60)}시간 ` : ''}${session.totalDurationMinutes % 60}분`
              : '-'}
          </p>
        </div>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-xs text-gray-400">운동 종류</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{session.exercises.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">완료 세트</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completedSets}/{totalSets}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Button fullWidth size="lg" onClick={() => navigate('/')}>홈으로</Button>
        <Button fullWidth variant="secondary" onClick={() => navigate('/history')}>이력 보기</Button>
      </div>
    </div>
  );
}
