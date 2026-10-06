import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutApi } from '../../api/workout';
import type { WorkoutSession } from '../../types';
import Button from '../../components/common/Button';
import Badge, { statusVariant } from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const MUSCLE_LABELS: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨', LEG: '하체',
  ARM: '팔', ABS: '복근', CARDIO: '유산소', ETC: '기타',
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Debounced set values stored separately from session to avoid focus loss */
type DraftEntry = { weight: number; reps: number };

export default function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [memo, setMemo] = useState('');
  const [completing, setCompleting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // draftDisplay: drives input values (triggers re-render)
  // draftLatest: ref copy for debounce closures (always fresh)
  const [draftDisplay, setDraftDisplay] = useState<Record<number, DraftEntry>>({});
  const draftLatest = useRef<Record<number, DraftEntry>>({});
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const memoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await workoutApi.getSession(Number(sessionId));
      setSession(res.data.data);
      setMemo(res.data.data.memo || '');
      draftLatest.current = {};
      setDraftDisplay({});
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { load(); }, [load]);

  const markSaved = () => {
    setSaveStatus('saved');
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaveStatus('idle'), 2500);
  };

  // --- Set input: draft-first, debounced save (no focus loss) ---
  const getWeight = (setId: number, fallback: number) =>
    draftDisplay[setId]?.weight ?? fallback;
  const getReps = (setId: number, fallback: number) =>
    draftDisplay[setId]?.reps ?? fallback;

  const handleSetInput = (
    exId: number,
    setId: number,
    field: 'weight' | 'reps',
    rawVal: string,
    currentCompleted: boolean,
    fallbackWeight: number,
    fallbackReps: number,
  ) => {
    const num = parseFloat(rawVal) || 0;
    const prev = draftLatest.current[setId] ?? { weight: fallbackWeight, reps: fallbackReps };
    const next: DraftEntry = { ...prev, [field]: num };
    draftLatest.current[setId] = next;
    setDraftDisplay((d) => ({ ...d, [setId]: next }));

    if (saveTimers.current[setId]) clearTimeout(saveTimers.current[setId]);
    saveTimers.current[setId] = setTimeout(async () => {
      if (!session) return;
      setSaveStatus('saving');
      try {
        await workoutApi.updateSet(session.sessionId, exId, setId, {
          weight: next.weight,
          reps: next.reps,
          completed: currentCompleted,
        });
        markSaved();
      } catch {
        setSaveStatus('error');
      }
    }, 700);
  };

  // --- Toggle set completion (updates session state) ---
  const handleToggleSet = async (exId: number, setId: number, completed: boolean, fallbackWeight: number, fallbackReps: number) => {
    if (!session || session.status !== 'IN_PROGRESS') return;
    const draft = draftLatest.current[setId];
    setSaveStatus('saving');
    try {
      const res = await workoutApi.updateSet(session.sessionId, exId, setId, {
        weight: draft?.weight ?? fallbackWeight,
        reps: draft?.reps ?? fallbackReps,
        completed: !completed,
      });
      setSession(res.data.data);
      markSaved();
    } catch {
      setSaveStatus('error');
    }
  };

  // --- Add set ---
  const handleAddSet = async (exId: number) => {
    if (!session) return;
    const exercise = session.exercises.find((e) => e.workoutExerciseId === exId);
    const lastSet = exercise?.sets[exercise.sets.length - 1];
    const lastId = lastSet?.workoutSetId;
    const weight = (lastId != null ? draftLatest.current[lastId]?.weight : undefined) ?? lastSet?.weight ?? 0;
    const reps = (lastId != null ? draftLatest.current[lastId]?.reps : undefined) ?? lastSet?.reps ?? 10;
    try {
      const res = await workoutApi.addSet(session.sessionId, exId, { weight, reps });
      setSession(res.data.data);
    } catch {
      alert('세트 추가에 실패했습니다.');
    }
  };

  // --- Memo autosave ---
  const handleMemoChange = (value: string) => {
    setMemo(value);
    if (memoTimer.current) clearTimeout(memoTimer.current);
    memoTimer.current = setTimeout(async () => {
      if (!session) return;
      setSaveStatus('saving');
      try {
        await workoutApi.updateMemo(session.sessionId, value);
        markSaved();
      } catch {
        setSaveStatus('error');
      }
    }, 800);
  };

  // --- Start / Complete ---
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

  if (loading) return (
    <div className="px-4 py-4 space-y-3">
      <SkeletonCard />
      <SkeletonCard lines={4} />
      <SkeletonCard lines={4} />
    </div>
  );
  if (error || !session) return <ErrorState onRetry={load} />;

  const isInProgress = session.status === 'IN_PROGRESS';
  const isPlanned = session.status === 'PLANNED';
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="pb-32">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-30">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-600 shrink-0"
            aria-label="뒤로가기"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate leading-tight">
              {session.displayName || '운동'}
            </p>
            <p className="text-xs text-gray-400">{session.workoutDate}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Auto-save status */}
            {saveStatus === 'saving' && (
              <span className="text-xs text-gray-400">저장 중...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-emerald-600">저장됨 ✓</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-500">저장 실패</span>
            )}
            <Badge variant={statusVariant(session.status)} />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* ── Exercise List ── */}
        {session.exercises.map((ex) => (
          <div key={ex.workoutExerciseId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Exercise header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div>
                <p className="font-semibold text-gray-900 leading-tight">{ex.exerciseName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{MUSCLE_LABELS[ex.muscleGroup] ?? ex.muscleGroup}</p>
              </div>
            </div>

            {/* Set table */}
            <div className="px-3 pt-2 pb-3">
              {/* Column headers */}
              <div className="grid grid-cols-[32px_1fr_1fr_44px] gap-1 mb-1.5 px-1">
                <span className="text-[11px] text-gray-400 text-center">세트</span>
                <span className="text-[11px] text-gray-400 text-center">중량 (kg)</span>
                <span className="text-[11px] text-gray-400 text-center">횟수</span>
                <span />
              </div>

              {/* Set rows */}
              {ex.sets.map((set) => {
                const w = getWeight(set.workoutSetId, set.weight);
                const r = getReps(set.workoutSetId, set.reps);
                const done = set.completed;
                return (
                  <div
                    key={set.workoutSetId}
                    className={`grid grid-cols-[32px_1fr_1fr_44px] gap-1 items-center mb-1 rounded-xl px-1 py-1.5
                      ${done ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Set number */}
                    <span className={`text-xs font-medium text-center ${done ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {set.setOrder}
                    </span>

                    {/* Weight input */}
                    <input
                      type="number"
                      inputMode="decimal"
                      className={`w-full text-center text-sm font-medium rounded-lg py-2 outline-none border transition-colors
                        ${done
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                        } ${isCompleted ? 'cursor-default' : ''}`}
                      value={w}
                      step="0.5"
                      disabled={isCompleted}
                      onChange={(e) => handleSetInput(
                        ex.workoutExerciseId, set.workoutSetId, 'weight', e.target.value,
                        set.completed, set.weight, set.reps
                      )}
                    />

                    {/* Reps input */}
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full text-center text-sm font-medium rounded-lg py-2 outline-none border transition-colors
                        ${done
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                        } ${isCompleted ? 'cursor-default' : ''}`}
                      value={r}
                      disabled={isCompleted}
                      onChange={(e) => handleSetInput(
                        ex.workoutExerciseId, set.workoutSetId, 'reps', e.target.value,
                        set.completed, set.weight, set.reps
                      )}
                    />

                    {/* Complete toggle */}
                    <button
                      disabled={isCompleted}
                      onClick={() => !isCompleted && handleToggleSet(
                        ex.workoutExerciseId, set.workoutSetId, set.completed, set.weight, set.reps
                      )}
                      className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full border-2 transition-colors
                        ${done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-300 text-transparent hover:border-emerald-400'
                        } ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
                      aria-label={done ? '완료 취소' : '완료'}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Add set button */}
              {!isCompleted && (
                <button
                  onClick={() => handleAddSet(ex.workoutExerciseId)}
                  className="w-full mt-2 py-2 text-sm text-emerald-700 border border-dashed border-emerald-300 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  + 세트 추가
                </button>
              )}
            </div>
          </div>
        ))}

        {/* ── Add Exercise ── */}
        {!isCompleted && (
          <button
            onClick={() => navigate(`/exercises/select?sessionId=${session.sessionId}`)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            운동 추가
          </button>
        )}

        {/* ── Memo ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">메모</p>
          <textarea
            className={`w-full text-sm text-gray-700 resize-none outline-none bg-transparent leading-relaxed
              ${isCompleted ? 'cursor-default text-gray-500' : 'placeholder-gray-300'}`}
            rows={3}
            placeholder="운동 메모를 입력하세요..."
            value={memo}
            disabled={isCompleted}
            onChange={(e) => handleMemoChange(e.target.value)}
          />
        </div>
      </div>

      {/* ── Fixed Action Bar ── */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 py-3 bg-white border-t border-gray-100 z-20">
        {isPlanned && (
          <Button fullWidth size="lg" onClick={handleStart}>
            운동 시작
          </Button>
        )}
        {isInProgress && (
          <Button fullWidth size="lg" onClick={handleComplete} loading={completing} variant="primary">
            운동 종료
          </Button>
        )}
        {isCompleted && (
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/history')}>
            이력 보기
          </Button>
        )}
      </div>
    </div>
  );
}
