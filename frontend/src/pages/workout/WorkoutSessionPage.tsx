import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutApi } from '../../api/workout';
import { statisticsApi } from '../../api/statistics';
import type { PrData, TrackingType, WorkoutSession } from '../../types';
import Button from '../../components/common/Button';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

const MUSCLE_LABELS: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨', LEG: '하체',
  ARM: '팔', ABS: '복근', CARDIO: '유산소', ETC: '기타',
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Debounced set values stored separately from session to avoid focus loss */
type DraftEntry = { weight: number; reps: number };

/** Returns the set columns to display based on exercise tracking type */
function getSetColumns(tt?: TrackingType): Array<'weight' | 'reps'> {
  if (tt === 'REPS_ONLY') return ['reps'];
  if (tt === 'DURATION') return ['reps'];
  if (tt === 'DISTANCE') return ['weight'];
  return ['weight', 'reps']; // WEIGHT_REPS or unknown
}

function colLabel(col: 'weight' | 'reps', tt?: TrackingType): string {
  if (col === 'weight') return tt === 'DISTANCE' ? '거리(km)' : '중량 kg';
  return tt === 'DURATION' ? '시간(분)' : '횟수';
}

export default function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [memo, setMemo] = useState('');
  const [completing, setCompleting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [prMap, setPrMap] = useState<Record<number, number>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // exerciseId of open 3-dot menu

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

  // Load PR data to show PR chip next to exercise name
  useEffect(() => {
    statisticsApi.getPRs()
      .then((r) => {
        const map: Record<number, number> = {};
        (r.data.data as PrData[]).forEach((p) => { map[p.exerciseId] = p.maxWeight; });
        setPrMap(map);
      })
      .catch(() => {}); // non-critical; silently ignore
  }, []);

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
      <SkeletonCard /><SkeletonCard lines={4} /><SkeletonCard lines={4} />
    </div>
  );
  if (error || !session) return <ErrorState onRetry={load} />;

  const isInProgress = session.status === 'IN_PROGRESS';
  const isPlanned    = session.status === 'PLANNED';
  const isCompleted  = session.status === 'COMPLETED';

  return (
    <div className="pb-40">

      {/* ─── Sticky header ── */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-30">
        <div className="flex items-center px-4 py-3 gap-2 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 shrink-0"
            aria-label="뒤로가기"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <p className="flex-1 text-center text-base font-semibold text-gray-900">운동 기록</p>
          <div className="shrink-0 min-w-[56px] text-right text-xs">
            {saveStatus === 'saving' && <span className="text-gray-400">저장 중…</span>}
            {saveStatus === 'saved'  && (
              <span className="text-emerald-600 flex items-center justify-end gap-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>저장됨
              </span>
            )}
            {saveStatus === 'error' && <span className="text-red-500">저장 실패</span>}
          </div>
        </div>
      </div>

      {/* ─── Session info row ── */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2 flex-wrap">
        <p className="text-xl font-bold text-gray-900">{session.displayName || '운동'}</p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isInProgress ? 'bg-emerald-100 text-emerald-700' :
          isCompleted  ? 'bg-gray-100 text-gray-600'      : 'bg-sky-50 text-sky-700'
        }`}>
          {isInProgress ? '진행 중' : isCompleted ? '완료' : '계획'}
        </span>
        <span className="text-sm text-secondary ml-auto">{session.workoutDate}</span>
      </div>

      {/* ─── Action buttons ── */}
      {!isCompleted && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate(`/exercises/select?sessionId=${session.sessionId}`)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-700">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            운동 추가
          </button>
          {/* 기존 운동 불러오기: favorites 필터로 연결 (별도 API 미구현, 보고 참조) */}
          <button
            onClick={() => navigate(`/exercises/select?sessionId=${session.sessionId}&mode=recent`)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
            </svg>
            기존 운동 불러오기
          </button>
        </div>
      )}

      {/* ─── Exercise list ── */}
      <div className="px-4 space-y-3">
        {session.exercises.map((ex) => {
          const cols     = getSetColumns(ex.trackingType);
          const hasW     = cols.includes('weight');
          const hasR     = cols.includes('reps');
          const gridCls  = cols.length === 2
            ? 'grid-cols-[32px_1fr_1fr_44px]'
            : 'grid-cols-[32px_1fr_44px]';
          const prWeight = prMap[ex.exerciseId];

          return (
            <div key={ex.workoutExerciseId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Exercise header */}
              <div className="flex items-center px-4 py-3 border-b border-gray-50 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{ex.exerciseName}</p>
                    {prWeight != null && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        PR {prWeight} kg
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary mt-0.5">{MUSCLE_LABELS[ex.muscleGroup] ?? ex.muscleGroup}</p>
                </div>
                {!isCompleted && (
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === ex.workoutExerciseId ? null : ex.workoutExerciseId)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {openMenuId === ex.workoutExerciseId && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[100px]">
                          <button
                            className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
                            onClick={async () => {
                              setOpenMenuId(null);
                              try {
                                await workoutApi.removeExercise(session.sessionId, ex.workoutExerciseId);
                                setSession((p) => p ? { ...p, exercises: p.exercises.filter((e) => e.workoutExerciseId !== ex.workoutExerciseId) } : p);
                              } catch { /* silent */ }
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Set table */}
              <div className="px-3 pt-2 pb-3">
                {/* Column headers */}
                <div className={`grid ${gridCls} gap-1 mb-1.5 px-0.5`}>
                  <span className="text-[11px] text-secondary text-center">세트</span>
                  {hasW && <span className="text-[11px] text-secondary text-center">{colLabel('weight', ex.trackingType)}</span>}
                  {hasR && <span className="text-[11px] text-secondary text-center">{colLabel('reps', ex.trackingType)}</span>}
                  <span />
                </div>

                {/* Set rows */}
                {ex.sets.map((set) => {
                  const w    = getWeight(set.workoutSetId, set.weight);
                  const r    = getReps(set.workoutSetId, set.reps);
                  const done = set.completed;
                  const inCls = `w-full text-center text-sm font-medium rounded-lg py-2 outline-none border transition-colors ${
                    done
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-50'
                  } ${isCompleted ? 'cursor-default' : ''}`;
                  return (
                    <div key={set.workoutSetId} className={`grid ${gridCls} gap-1 items-center mb-1 rounded-xl px-0.5 py-1.5 ${done ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                      <span className={`text-xs font-semibold text-center ${done ? 'text-emerald-600' : 'text-secondary'}`}>{set.setOrder}</span>
                      {hasW && (
                        <input type="number" inputMode="decimal" className={inCls} value={w} step="0.5" disabled={isCompleted}
                          onChange={(e) => handleSetInput(ex.workoutExerciseId, set.workoutSetId, 'weight', e.target.value, set.completed, set.weight, set.reps)} />
                      )}
                      {hasR && (
                        <input type="number" inputMode="numeric" className={inCls} value={r} disabled={isCompleted}
                          onChange={(e) => handleSetInput(ex.workoutExerciseId, set.workoutSetId, 'reps', e.target.value, set.completed, set.weight, set.reps)} />
                      )}
                      <button
                        disabled={isCompleted}
                        onClick={() => !isCompleted && handleToggleSet(ex.workoutExerciseId, set.workoutSetId, set.completed, set.weight, set.reps)}
                        className={`flex items-center justify-center w-9 h-9 mx-auto rounded-lg border-2 transition-colors ${
                          done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 text-transparent hover:border-emerald-400'
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

                {/* Add set */}
                {!isCompleted && (
                  <button
                    onClick={() => handleAddSet(ex.workoutExerciseId)}
                    className="w-full mt-2 py-2.5 text-sm font-medium text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    + 세트 추가
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* ─── Memo ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">메모</p>
          <textarea
            className={`w-full text-sm resize-none outline-none bg-transparent leading-relaxed ${
              isCompleted ? 'text-gray-500 cursor-default' : 'text-gray-700 placeholder-gray-300'
            }`}
            rows={3}
            placeholder="오늘 운동은 어땠나요?"
            value={memo}
            disabled={isCompleted}
            onChange={(e) => handleMemoChange(e.target.value)}
          />
        </div>
      </div>

      {/* ─── Fixed bottom action ── */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 py-3 bg-white border-t border-gray-100 z-20">
        {isPlanned    && <Button fullWidth size="lg" onClick={handleStart}>운동 시작</Button>}
        {isInProgress && <Button fullWidth size="lg" onClick={handleComplete} loading={completing}>운동 종료</Button>}
        {isCompleted  && <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/history')}>이력 보기</Button>}
      </div>
    </div>
  );
}
