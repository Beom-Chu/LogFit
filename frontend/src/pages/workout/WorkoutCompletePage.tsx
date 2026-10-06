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

  const durationStr = session.totalDurationMinutes != null
    ? `${Math.floor(session.totalDurationMinutes / 60) > 0
        ? `${Math.floor(session.totalDurationMinutes / 60)}시간 ` : ''}${session.totalDurationMinutes % 60}분`
    : '-';

  return (
    <div className="min-h-screen bg-[#F5F7F8] flex flex-col items-center justify-center px-6 gap-8">
      {/* Success Icon */}
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">운동 완료!</h1>
        <p className="text-gray-400 text-sm mt-1">{session.workoutDate}</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-sm">
        <div className="text-center mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">총 운동시간</p>
          <p className="text-4xl font-bold text-emerald-700">{durationStr}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{session.exercises.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">운동 종류</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              <span className="text-emerald-700">{completedSets}</span>
              <span className="text-gray-300 text-lg">/{totalSets}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">완료 세트</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Button fullWidth size="lg" onClick={() => navigate('/')}>홈으로</Button>
        <Button fullWidth variant="secondary" onClick={() => navigate('/history')}>이력 보기</Button>
      </div>
    </div>
  );
}
