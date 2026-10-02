import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutApi } from '../../api/workout';
import type { WorkoutSession } from '../../types';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const MUSCLE_LABELS: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨', LEG: '하체', ARM: '팔', ABS: '복근', CARDIO: '유산소', ETC: '기타',
};

export default function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const memoTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await workoutApi.getSession(Number(sessionId));
      setSession(res.data.data);
      setMemo(res.data.data.memo || '');
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { load(); }, [load]);

  const handleStart = async () => {
    if (!session) return;
    try {
      const res = await workoutApi.startSession(session.sessionId);
      setSession(res.data.data);
    } catch {
      alert('운동 시작에 실패했습니다.');
    }
  };

  const handleComplete = async () => {
    if (!session) return;
    setCompleting(true);
    try {
      const res = await workoutApi.completeSession(session.sessionId);
      setSession(res.data.data);
      navigate(`/workout/${session.sessionId}/complete`);
    } catch {
      alert('운동 완료에 실패했습니다.');
    } finally {
      setCompleting(false);
    }
  };

  const handleMemoChange = (value: string) => {
    setMemo(value);
    if (memoTimeout.current) clearTimeout(memoTimeout.current);
    memoTimeout.current = setTimeout(async () => {
      if (!session) return;
      setSaving(true);
      try {
        await workoutApi.updateMemo(session.sessionId, value);
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const handleToggleSet = async (workoutExerciseId: number, setId: number, currentCompleted: boolean, weight: number, reps: number) => {
    if (!session || session.status !== 'IN_PROGRESS') return;
    try {
      const res = await workoutApi.updateSet(session.sessionId, workoutExerciseId, setId, {
        weight, reps, completed: !currentCompleted,
      });
      setSession(res.data.data);
    } catch {
      // silent fail
    }
  };

  const handleAddSet = async (workoutExerciseId: number) => {
    if (!session) return;
    const exercise = session.exercises.find((e) => e.workoutExerciseId === workoutExerciseId);
    const lastSet = exercise?.sets[exercise.sets.length - 1];
    try {
      const res = await workoutApi.addSet(session.sessionId, workoutExerciseId, {
        weight: lastSet?.weight || 0,
        reps: lastSet?.reps || 10,
      });
      setSession(res.data.data);
    } catch {
      alert('세트 추가에 실패했습니다.');
    }
  };

  const handleUpdateSet = async (workoutExerciseId: number, setId: number, field: 'weight' | 'reps', value: number) => {
    if (!session) return;
    const exercise = session.exercises.find((e) => e.workoutExerciseId === workoutExerciseId);
    const set = exercise?.sets.find((s) => s.workoutSetId === setId);
    if (!set) return;
    try {
      const res = await workoutApi.updateSet(session.sessionId, workoutExerciseId, setId, {
        weight: field === 'weight' ? value : set.weight,
        reps: field === 'reps' ? value : set.reps,
        completed: set.completed,
      });
      setSession(res.data.data);
    } catch {
      // silent
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (error || !session) return <ErrorState onRetry={load} />;

  const isInProgress = session.status === 'IN_PROGRESS';
  const isPlanned = session.status === 'PLANNED';
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{session.displayName || '운동 없음'}</p>
            <p className="text-xs text-gray-400">{session.workoutDate}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium
            ${isCompleted ? 'bg-blue-100 text-blue-700' : isInProgress ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {isCompleted ? '완료' : isInProgress ? '진행중' : '계획'}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Exercise List */}
        {session.exercises.map((ex) => (
          <div key={ex.workoutExerciseId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{ex.exerciseName}</p>
                <p className="text-xs text-gray-400">{MUSCLE_LABELS[ex.muscleGroup] || ex.muscleGroup}</p>
              </div>
            </div>

            {/* Sets */}
            <div className="px-4 py-2">
              <div className="flex text-xs text-gray-400 mb-1 gap-2">
                <span className="w-6">세트</span>
                <span className="flex-1 text-center">중량(kg)</span>
                <span className="flex-1 text-center">횟수</span>
                <span className="w-6" />
              </div>
              {ex.sets.map((set) => (
                <div key={set.workoutSetId} className={`flex items-center gap-2 py-1.5 rounded-lg px-1 mb-1
                  ${set.completed ? 'bg-blue-50' : ''}`}>
                  <span className="text-xs text-gray-500 w-6 text-center">{set.setOrder}</span>
                  <input
                    type="number"
                    className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-1.5 outline-none"
                    value={set.weight}
                    disabled={isCompleted}
                    onChange={(e) => handleUpdateSet(ex.workoutExerciseId, set.workoutSetId, 'weight', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-1.5 outline-none"
                    value={set.reps}
                    disabled={isCompleted}
                    onChange={(e) => handleUpdateSet(ex.workoutExerciseId, set.workoutSetId, 'reps', Number(e.target.value))}
                  />
                  <button
                    onClick={() => isCompleted ? null : handleToggleSet(ex.workoutExerciseId, set.workoutSetId, set.completed, set.weight, set.reps)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${set.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}
                  >
                    {set.completed && '✓'}
                  </button>
                </div>
              ))}
              {!isCompleted && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAddSet(ex.workoutExerciseId)}
                    className="flex-1 py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    + 세트 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Exercise */}
        {!isCompleted && (
          <button
            onClick={() => navigate(`/exercises/select?sessionId=${session.sessionId}`)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            + 운동 추가
          </button>
        )}

        {/* Memo */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">메모 {saving && <span className="text-xs text-gray-400 ml-1">저장중...</span>}</p>
          <textarea
            className="w-full text-sm text-gray-700 resize-none outline-none"
            rows={3}
            placeholder="운동 메모를 입력하세요..."
            value={memo}
            disabled={isCompleted}
            onChange={(e) => handleMemoChange(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100 max-w-lg mx-auto">
        {isPlanned && (
          <Button fullWidth size="lg" onClick={handleStart}>운동 시작</Button>
        )}
        {isInProgress && (
          <Button fullWidth size="lg" onClick={handleComplete} loading={completing}>운동 종료</Button>
        )}
        {isCompleted && (
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/history')}>이력 보기</Button>
        )}
      </div>
    </div>
  );
}
